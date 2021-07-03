
/**
 * 例外
 */
export class Exception extends Error {
  /**
   * 元の例外の配列
   */
  #causes: Array<Error>;

  /**
   * @param name 名称
   * @param message メッセージ
   * @param causes 元の例外の配列
   */
  constructor (name: string, message: string, causes: Array<Error> = []) {
    super(message);

    this.name = name;
    this.#causes = [];
    for (const cause of causes) {
      this.#causes.push(cause);
    }

    Object.freeze(this.#causes);
    Object.freeze(this);
  }

  /**
   * 元の例外の配列
   */
  get causes(): Array<Error> {
    return this.#causes;
  }
}

/**
 * 文字列を、指定したUTF-16コードユニット数ごとに分割し返却
 *     ※サロゲートペア、合成文字が分割される可能性あり
 * @param str 分割する文字列
 * @param segmentLength 分割単位とするUTF-16コードユニット数
 * @param paddingUnit 分割結果の配列の最後の要素がunitGroupSizeに満たない場合、最後の要素の末尾を埋める文字列
 * @returns strをunitGroupSize UTF-16コードユニットごとに分割した文字列配列
 */
export function devideStringByLength(str: string, segmentLength: number, paddingUnit?: string): Array<string> {
  if (Number.isSafeInteger(segmentLength) !== true) {
    throw new TypeError("TODO");
  }
  if (segmentLength <= 0) {
    throw new TypeError("TODO");
  }
  if ((typeof paddingUnit === "string") && (paddingUnit.length !== 1)) {
    throw new TypeError("TODO");
  }

  const segemntsCount = Math.ceil(str.length / segmentLength);
  const segments: Array<string> = new Array<string>(segemntsCount);
  let pos = 0;
  for (let i = 0; i < segemntsCount; i++) {
    segments[i] = str.substring(pos, pos + segmentLength);
    pos = pos + segmentLength;
  }

  if (typeof paddingUnit === "string") {
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) {
      segments[segments.length - 1] = lastSegment.padEnd(segmentLength, paddingUnit);
    }
  }

  return segments;
}
