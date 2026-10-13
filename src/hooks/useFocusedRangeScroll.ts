import { useEffect, useMemo, useCallback } from 'react';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

export type IndexRange = {
  startIndex: number;
  endIndex: number;
};

export type FocusedRangeScrollConfig = {
  itemCount: number;
  rowHeight: number;

  /**
   * Number of rows below the top of the viewport used to determine the focused row.
   */
  focusOffsetRows?: number;

  /**
   * List of logical ranges.
   *
   * Example:
   * [
   *   { startIndex: 0, endIndex: 10 },
   *   { startIndex: 11, endIndex: 40 }
   * ]
   */
  ranges: IndexRange[];
};

/**
 * Build row -> range lookup table.
 */
function buildRowToRange(itemCount: number, ranges: IndexRange[]): number[] {
  const rowToRange = new Array<number>(itemCount);

  ranges.forEach((range, rangeIndex) => {
    for (let rowIndex = range.startIndex; rowIndex <= range.endIndex; rowIndex++) {
      rowToRange[rowIndex] = rangeIndex;
    }
  });

  return rowToRange;
}

/**
 * Get the logical range currently focused by a vertical scroll position.
 *
 * Worklet-safe:
 * - accepts only numbers / plain arrays
 * - contains no application/domain objects
 */
function getFocusedRangeIndex({ scrollY, itemCount, rowHeight, focusOffsetRows, rowToRange }: {
  scrollY: number;
  itemCount: number;
  rowHeight: number;
  focusOffsetRows: number;
  rowToRange: number[];
}): number {
  'worklet';

  if (itemCount <= 0 || rowHeight <= 0) {
    return 0;
  }

  const rawIndex = Math.floor((scrollY + focusOffsetRows * rowHeight) / rowHeight);
  const rowIndex = Math.max(0, Math.min(itemCount - 1, rawIndex));

  return rowToRange[rowIndex] ?? 0;
}

/********************************************************************************************************************
 * Generic range-based scrolling state. Given a list of items, items are grouped by their logical range.
 * All focus calculations and updates happen on the UI thread.
 * 
 * For example:
 *  - Days in a month, row 1-30 represents Jan, row 31-60 represents Feb etc.
 *  - We want to fade rows 1-30 out because row 31-60 is now occupying a majority of the scroll view.
 *
 * Provides:
 * - focused range index
 * - focused start row
 * - focused end row
 * - Reanimated scroll handler
 * 
 * @param scrollY - the current ScrollView Y scroll value
 * @param itemCount - how many total items in the list
 * @param rowHeight - height in px of each row
 * @param focusOffsetRows - how many rows below the top of the scrollView do we consider as "switched" to the next range
 * @param ranges - a mapping of the range
 *
 * @returns
 *  - focusedRangeIndex: focused range index
 *  - focusedStartIndex: focused start row
 *  - focusedEndIndex: focused end row
 *  - handleScroll: Reanimated scroll handler
 ********************************************************************************************************************/
export function useFocusedRangeScroll({
  itemCount,
  rowHeight,
  focusOffsetRows = 0,
  ranges,
}: FocusedRangeScrollConfig) {

  const rowToRange = useMemo(() => buildRowToRange(itemCount, ranges), [itemCount, ranges]);
  const focusedRangeIndex = useSharedValue(0);
  const focusedStartIndex = useSharedValue(ranges[0]?.startIndex ?? 0);
  const focusedEndIndex = useSharedValue(ranges[0]?.endIndex ?? 0);

  /**
   * Reset if the data changes.
   */
  useEffect(() => {
    const range = ranges[0];
    focusedRangeIndex.value = 0;
    focusedStartIndex.value = range?.startIndex ?? 0;
    focusedEndIndex.value = range?.endIndex ?? 0;
  }, [ranges, focusedRangeIndex, focusedStartIndex, focusedEndIndex]);

  /**
   * Scroll.
   */
  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {

      const rangeIndex = getFocusedRangeIndex({
        scrollY: event.contentOffset.y,
        itemCount,
        rowHeight,
        focusOffsetRows,
        rowToRange
      });

      // still inside the same logical range
      if (rangeIndex === focusedRangeIndex.value) {
        return;
      }

      const range = ranges[rangeIndex];

      if (!range) {
        return;
      }

      focusedRangeIndex.value = rangeIndex;
      focusedStartIndex.value = range.startIndex;
      focusedEndIndex.value = range.endIndex;
    }
  });

  return { focusedRangeIndex, focusedStartIndex, focusedEndIndex, handleScroll };
}