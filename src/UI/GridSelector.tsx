import React, { memo, useCallback, useMemo } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { rgba32ToRgbaCss } from '../Utils/Colors';
import Touchable from './Touchable';
import { GRID_SELECTOR } from '../Defines/Styles';

/******************************************************************************************************************
 * GridSelector props
 ******************************************************************************************************************/
export type GridSelectorItem =
  | { key: string; type: 'color'; value: number } // RGBA32 0xRRGGBBAA
  | { key: string; type: 'icon'; value: keyof typeof MaterialCommunityIcons.glyphMap };

type CommonProps = {
  items: GridSelectorItem[];
  cellSize?: number;

  selectedKey?: string | null;
  onSelect: (item: GridSelectorItem, index: number) => void;

  disabled?: boolean;
  style?: StyleProp<ViewStyle>;

  outlineWidth?: number;
  iconSize?: number;
  iconColor?: string;

  snapToPage?: boolean; // page snapping along scroll axis
};

/**
 * Exactly one of maxRows or maxCols must be provided.
 * - maxRows => horizontal scroll (rows fixed, columns grow)
 * - maxCols => vertical scroll (cols fixed, rows grow)
 */
export type GridSelectorProps =
  | (CommonProps & { maxRows: number; maxCols?: never })
  | (CommonProps & { maxCols: number; maxRows?: never });

const GridSelector: React.FC<GridSelectorProps> = memo((props) => {
  const theme = useTheme();

  const {
    items,
    cellSize = GRID_SELECTOR.cellSize,
    selectedKey,
    onSelect,
    disabled,
    style,
    outlineWidth = 2,
    iconSize,
    iconColor,
    snapToPage = false,
  } = props;

  const axis: 'horizontal' | 'vertical' = 'maxRows' in props ? 'horizontal' : 'vertical';

  const resolvedIconSize = iconSize ?? Math.floor(cellSize * 0.6);
  const resolvedIconColor = iconColor ?? theme.colors.onSurfaceVariant;

  const handleSelect = useCallback(
    (item: GridSelectorItem, index: number) => {
      if (disabled) return;
      onSelect(item, index);
    },
    [disabled, onSelect]
  );

  /**
   * Layout model:
   * - Horizontal scroll:
   *    fixed rows = maxRows
   *    pageCols = maxColsPerPage (optional) -> we can just treat one page as "as many cols as needed".
   *    To support snap, we define a reasonable pageCols = max(1, ceil(items.length / rows))? But that becomes 1 page.
   *
   *   Better:
   *    Use a constant "pageCols" so snapping feels consistent. We'll use 8 by default (like palettes).
   *    Parent can override via snapToPage? For now, if snapToPage true, we pick pageCols=8, else one big strip.
   *
   * - Vertical scroll:
   *    fixed cols = maxCols
   *    rows grow; optionally snap by "pageRows" when snapToPage is true.
   */

  // Tuning constants (small + sensible defaults)
  const DEFAULT_PAGE_COLS = 8;
  const DEFAULT_PAGE_ROWS = 4;

  if (axis === 'horizontal') {
    const fixedRows = Math.max(1, (props as any).maxRows);
    const pageCols = snapToPage ? DEFAULT_PAGE_COLS : Math.max(1, Math.ceil(items.length / fixedRows)); // 1 strip if not snapping
    const pageSize = fixedRows * pageCols;

    const pages = useMemo(() => {
      const out: GridSelectorItem[][] = [];
      for (let i = 0; i < items.length; i += pageSize) out.push(items.slice(i, i + pageSize));
      return out;
    }, [items, pageSize]);

    const pageWidth = pageCols * cellSize;
    const viewHeight = fixedRows * cellSize;
    const isScrollable = pages.length > 1;

    return (
      <View style={[styles.wrap, style, { height: viewHeight }]}>
        <ScrollView
          horizontal
          scrollEnabled={isScrollable && !disabled}
          showsHorizontalScrollIndicator={false}
          bounces
          scrollEventThrottle={16}
          pagingEnabled={snapToPage}
          snapToInterval={snapToPage ? pageWidth : undefined}
          decelerationRate={snapToPage ? 'fast' : 'normal'}
        >
          {pages.map((page, pageIdx) => (
            <View
              key={`page-${pageIdx}`}
              style={[styles.page, { width: pageWidth, height: viewHeight }]}
            >
              {page.map((item, i) => {
                const globalIndex = pageIdx * pageSize + i;
                const r = Math.floor(i / pageCols);
                const c = i % pageCols;

                const isSelected = selectedKey != null && item.key === selectedKey;

                return (
                  <Touchable
                    key={item.key}
                    disabled={disabled}
                    onPress={() => handleSelect(item, globalIndex)}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                        left: c * cellSize,
                        top: r * cellSize,
                        borderWidth: isSelected ? outlineWidth : 0,
                        borderColor: isSelected ? theme.colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {item.type === 'color' ? (
                      <View style={[styles.fill, { backgroundColor: rgba32ToRgbaCss(item.value) }]} />
                    ) : (
                      <View style={styles.center}>
                        <MaterialCommunityIcons
                          name={item.value}
                          size={resolvedIconSize}
                          color={resolvedIconColor}
                        />
                      </View>
                    )}
                  </Touchable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // axis === 'vertical'
  const fixedCols = Math.max(1, (props as any).maxCols);
  const pageRows = snapToPage ? DEFAULT_PAGE_ROWS : Math.max(1, Math.ceil(items.length / fixedCols)); // 1 strip if not snapping
  const pageSize = fixedCols * pageRows;

  const pages = useMemo(() => {
    const out: GridSelectorItem[][] = [];
    for (let i = 0; i < items.length; i += pageSize) out.push(items.slice(i, i + pageSize));
    return out;
  }, [items, pageSize]);

  const pageHeight = pageRows * cellSize;
  const viewWidth = fixedCols * cellSize;

  return (
    <View style={[styles.wrap, style, { width: viewWidth }]}>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        bounces
        scrollEventThrottle={16}
        pagingEnabled={snapToPage}
        snapToInterval={snapToPage ? pageHeight : undefined}
        decelerationRate={snapToPage ? 'fast' : 'normal'}
      >
        {pages.map((page, pageIdx) => (
          <View
            key={`page-${pageIdx}`}
            style={[styles.page, { width: viewWidth, height: pageHeight }]}
          >
            {page.map((item, i) => {
              const globalIndex = pageIdx * pageSize + i;
              const r = Math.floor(i / fixedCols);
              const c = i % fixedCols;

              const isSelected = selectedKey != null && item.key === selectedKey;

              return (
                <Touchable
                  key={item.key}
                  disabled={disabled}
                  onPress={() => handleSelect(item, globalIndex)}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      left: c * cellSize,
                      top: r * cellSize,
                      borderWidth: isSelected ? outlineWidth : 0,
                      borderColor: isSelected ? theme.colors.primary : 'transparent',
                    },
                  ]}
                >
                  {item.type === 'color' ? (
                    <View style={[styles.fill, { backgroundColor: rgba32ToRgbaCss(item.value) }]} />
                  ) : (
                    <View style={styles.center}>
                      <MaterialCommunityIcons
                        name={item.value}
                        size={resolvedIconSize}
                        color={resolvedIconColor}
                      />
                    </View>
                  )}
                </Touchable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  page: { position: 'relative', overflow: 'hidden' },
  cell: { position: 'absolute', overflow: 'hidden' },
  fill: { ...StyleSheet.absoluteFill },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});

export default GridSelector;