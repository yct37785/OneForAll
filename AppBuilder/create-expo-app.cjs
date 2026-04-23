#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

function section(title) {
  console.log('\n==================================================');
  console.log(title);
  console.log('==================================================');
}

function fail(message) {
  throw new Error(message);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Required file not found: ${filePath}`);
  }
}

function requireDir(dirPath) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    fail(`Required directory not found: ${dirPath}`);
  }
}

function readDependencyFile(filePath) {
  requireFile(filePath);

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function getCommand(command) {
  if (process.platform !== 'win32') {
    return command;
  }

  if (command === 'npx') return 'npx.cmd';
  if (command === 'npm') return 'npm.cmd';
  return command;
}

function formatCmdArg(value) {
  const str = String(value);
  return str.includes(' ') ? `"${str}"` : str;
}

function run(command, args, cwd) {
  const resolvedCommand = getCommand(command);

  if (process.platform === 'win32') {
    const commandLine = [resolvedCommand, ...args.map(formatCmdArg)].join(' ');
    console.log(`\n> ${commandLine}`);

    const result = spawnSync('cmd.exe', ['/d', '/s', '/c', commandLine], {
      cwd,
      stdio: 'inherit',
      windowsHide: false,
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      fail(`Command failed with exit code ${result.status}: ${commandLine}`);
    }

    return;
  }

  console.log(`\n> ${resolvedCommand} ${args.join(' ')}`);

  const result = spawnSync(resolvedCommand, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    fail(`Command failed with exit code ${result.status}: ${resolvedCommand} ${args.join(' ')}`);
  }
}

function slugifyAppName(appName) {
  return appName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function copyDirectoryContents(sourceDir, targetDir) {
  requireDir(sourceDir);

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyDirectoryContents(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

function renderAppConfig(templateContent, { appName, packageName, slug }) {
  return templateContent
    .replaceAll('__APP_NAME__', appName)
    .replaceAll('__APP_SLUG__', slug)
    .replaceAll('__APP_PACKAGE__', packageName);
}

function updatePackageJsonScripts(appDir) {
  const packageJsonPath = path.join(appDir, 'package.json');
  requireFile(packageJsonPath);

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.scripts = {
    start: 'expo start',
    android: 'expo run:android',
    ios: 'expo run:ios',
    web: 'expo start --web',
    setup: 'npm install',
    'setup:clean': 'rm -rf node_modules package-lock.json && npm install',
    typecheck: 'tsc -b -v',
  };

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
  console.log('Updated: package.json scripts');
}

async function main() {
  try {
    const builderDir = path.resolve(__dirname);
    const oneForAllDir = path.resolve(builderDir, '..');
    const workspaceDir = path.resolve(oneForAllDir, '..');

    const depsFile = path.join(builderDir, 'dependencies.txt');
    const devDepsFile = path.join(builderDir, 'dev dependencies.txt');

    const filesDir = path.join(builderDir, 'files');
    const appConfigTemplateFile = path.join(filesDir, 'app.config.js');

    section('OneForAll Expo App Generator');
    console.log(`BAT location        : ${path.join(oneForAllDir, 'create-expo-app.bat')}`);
    console.log(`Builder directory   : ${builderDir}`);
    console.log(`OneForAll directory : ${oneForAllDir}`);
    console.log(`Workspace directory : ${workspaceDir}`);
    console.log(`Files directory     : ${filesDir}`);

    requireFile(depsFile);
    requireFile(devDepsFile);
    requireDir(filesDir);
    requireFile(appConfigTemplateFile);

    section('Step 1: App name');
    const appName = await ask('Enter app name (example: MyAppName): ');
    if (!appName) {
      fail('App name is required.');
    }

    section('Step 2: Package name');
    const packageName = await ask('Enter package name (example: com.mycompany.myappname): ');
    if (!packageName) {
      fail('Package name is required.');
    }

    const slug = slugifyAppName(appName);
    const appDir = path.join(workspaceDir, appName);

    console.log(`\nApp name     : ${appName}`);
    console.log(`Package name : ${packageName}`);
    console.log(`Slug         : ${slug}`);
    console.log(`Target dir   : ${appDir}`);

    if (fs.existsSync(appDir)) {
      fail(`Target directory already exists: ${appDir}`);
    }

    section('Step 3: Creating Expo app');
    run('npx', ['create-expo-app@latest', appName, '-t', 'expo-template-blank-typescript'], workspaceDir);

    if (!fs.existsSync(appDir)) {
      fail(`Expo app folder was not created: ${appDir}`);
    }

    section('Step 4: Installing dependencies');
    const deps = readDependencyFile(depsFile);
    const devDeps = readDependencyFile(devDepsFile);

    console.log(`Dependencies found     : ${deps.length}`);
    console.log(`Dev dependencies found : ${devDeps.length}`);

    if (deps.length > 0) {
      run('npx', ['expo', 'install', ...deps], appDir);
    }

    if (devDeps.length > 0) {
      run('npm', ['install', '-D', ...devDeps], appDir);
    }

    section('Step 5: Copying AppBuilder files');
    copyDirectoryContents(filesDir, appDir);

    section('Step 6: Replacing app.json with app.config.js');
    const appJsonPath = path.join(appDir, 'app.json');
    const appConfigPath = path.join(appDir, 'app.config.js');

    if (fs.existsSync(appJsonPath)) {
      fs.unlinkSync(appJsonPath);
      console.log('Deleted: app.json');
    }

    const appConfigTemplate = fs.readFileSync(appConfigTemplateFile, 'utf8');
    const renderedAppConfig = renderAppConfig(appConfigTemplate, {
      appName,
      packageName,
      slug,
    });

    fs.writeFileSync(appConfigPath, renderedAppConfig, 'utf8');
    console.log('Generated: app.config.js');

    section('Step 7: Replacing package.json scripts');
    updatePackageJsonScripts(appDir);

    section('Done');
    console.log(`Expo app created successfully: ${appDir}`);
    console.log(`App name applied             : ${appName}`);
    console.log(`Package name applied         : ${packageName}`);
    console.log(`Slug applied                 : ${slug}`);
  } catch (error) {
    console.error(`\n[ERROR] ${error.message}`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();