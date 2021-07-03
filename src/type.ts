
/**
 * 8ビット符号なし整数の最小値
 */
const MIN_VALUE = 0x0;

/**
 * 8ビット符号なし整数の最大値
 */
const MAX_VALUE = 0xFF;

/**
 * 対象が8ビット符号なし整数であるか否かを返却
 * @param value 検査対象
 * @returns valueが8ビット符号なし整数であるか否か
 */
export function isByte(value: unknown): boolean {
  if (typeof value === "number") {
    return (Number.isSafeInteger(value) && (value >= MIN_VALUE) && (value <= MAX_VALUE));
  }
  return false;
}
