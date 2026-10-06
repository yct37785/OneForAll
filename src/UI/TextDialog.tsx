import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog as PaperDialog,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { s } from '../defines/styles';
import IconButton from './IconButton';

/******************************************************************************************************************
 * Dialog props
 ******************************************************************************************************************/
export type DialogAction = {
  label: string;
  color?: string;
  action: () => void;
};

export type DialogProps = {
  visible?: boolean;
  title?: string;
  subTitle?: string;
  onClose?: () => void;
  actions?: DialogAction[];
  dismissable?: boolean;
};

/******************************************************************************************************************
 * TextDialog
 * ----
 * Generic text dialog wrapper:
 *  - Top-right close button
 *  - Optional title and subtitle
 *  - Action buttons
 ******************************************************************************************************************/
const TextDialog: React.FC<DialogProps> = memo(
  ({
    visible = true,
    title,
    subTitle,
    onClose,
    actions = [],
    dismissable = true,
  }) => {
    const theme = useTheme();

    return (
      <Portal>
        <PaperDialog
          visible={visible}
          onDismiss={onClose}
          dismissable={dismissable}
          style={styles.dialog}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              {title ? (
                <Text variant='titleMedium' style={{ color: theme.colors.onSurface }}>
                  {title}
                </Text>
              ) : null}
            </View>

            {dismissable ? (
              <IconButton
                icon='close'
                onPress={onClose}
                iconColor={theme.colors.onSurfaceVariant}
              />
            ) : null}
          </View>

          {/* Subtitle */}
          <PaperDialog.Content>
            {subTitle ? (
              <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                {subTitle}
              </Text>
            ) : null}
          </PaperDialog.Content>

          {/* Actions */}
          {actions.length > 0 ? (
            <PaperDialog.Actions style={styles.actions}>
              {actions.map((item, idx) => (
                <Button
                  key={`${item.label}-${idx}`}
                  onPress={item.action}
                  textColor={item.color}
                >
                  {item.label}
                </Button>
              ))}
            </PaperDialog.Actions>
          ) : null}
        </PaperDialog>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  dialog: {
    borderRadius: s(2)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: s(3),
    paddingRight: s(2)
  },
  headerTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    paddingHorizontal: s(2)
  },
});

export default TextDialog;