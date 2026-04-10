/******************************************************************************************************************
 * DebouncedCallback
 * ----
 * Behavior:
 *  - First call triggers immediately
 *  - While within cooldown window, later calls are held
 *  - Only the latest held callback is kept
 *  - When cooldown ends, held callback triggers once
 ******************************************************************************************************************/
export class DebouncedCallback {
  private readonly delayMs: number;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingFn: (() => void | Promise<void>) | null = null;

  constructor(delayMs: number) {
    this.delayMs = Math.max(0, delayMs);
  }

  /**************************************************************************************************************
   * Call:
   *  - triggers immediately if idle
   *  - otherwise stores latest pending callback
   **************************************************************************************************************/
  call(fn: () => void | Promise<void>): void {
    if (!this.timer) {
      this.invoke(fn);
      this.startWindow();
      return;
    }

    this.pendingFn = fn;
  }

  /**************************************************************************************************************
   * Cancel:
   *  - clears cooldown timer
   *  - clears any pending held callback
   **************************************************************************************************************/
  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.pendingFn = null;
  }

  /**************************************************************************************************************
   * Flush:
   *  - immediately runs pending held callback if present
   *  - restarts cooldown window
   **************************************************************************************************************/
  flush(): void {
    if (!this.pendingFn) return;

    const fn = this.pendingFn;
    this.pendingFn = null;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.invoke(fn);
    this.startWindow();
  }

  /**************************************************************************************************************
   * Has pending held callback
   **************************************************************************************************************/
  hasPending(): boolean {
    return !!this.pendingFn;
  }

  /**************************************************************************************************************
   * Cleanup
   **************************************************************************************************************/
  dispose(): void {
    this.cancel();
  }

  /**************************************************************************************************************
   * Internal
   **************************************************************************************************************/
  private startWindow(): void {
    this.timer = setTimeout(() => {
      this.timer = null;

      if (!this.pendingFn) return;

      const fn = this.pendingFn;
      this.pendingFn = null;

      this.invoke(fn);
      this.startWindow();
    }, this.delayMs);
  }

  private invoke(fn: () => void | Promise<void>): void {
    try {
      void fn();
    } catch (err) {
      console.log('DebouncedCallback invoke failed:', err);
    }
  }
}