//

import {
  type int,
  type uint8,
  Integer,
  StringUtils,
} from "@i-xi-dev/fundamental";

/**
 * 対応する基数
 */
const _radixes = [ 2, 8, 10, 16 ] as const;

/**
 * @param value 検査する値
 * @returns `value`は`ByteFormat.Radix`型であるか否か
 */
function _isRadix(value: unknown): value is ByteFormat.Radix {
  if (typeof value === "number") {
    return (_radixes as ReadonlyArray<number>).includes(value);
  }
  return false;
}

/**
 * フォーマット基数に応じた前方ゼロ埋め結果の最小文字列長を返却
 *
 * @param radix フォーマット基数
 * @returns フォーマット結果の前方ゼロ埋め結果の最小文字列長
 */
function _minPaddedLengthOf(radix: ByteFormat.Radix): int {
  switch (radix) {
  case 2:
    return 8;
  case 8:
    return 3;
  case 10:
    return 3;
  case 16:
    return 2;
      // default:
      //   return -1 as never;
  }
}

/**
 * `ByteFormat.Options`の各項目を省略不可にしたオプション
 */
type _ResolvedOptions = {
  /** 基数 */
  radix: ByteFormat.Radix;

  /** 前方埋め結果の文字列長 */
  paddedLength: int;

  /** 16進数のa-fを小文字にするか否か */
  lowerCase: boolean;

  /** 各バイトのプレフィックス */
  prefix: string;

  /** 各バイトのサフィックス */
  suffix: string;

  /** 各バイトの連結子 */
  separator: string;
};

/**
 * オプションの省略項目にデフォルト値をセットした`_ResolvedOptions`を返却
 *
 * @param options 省略項目があるかもしれないオプション
 * @returns 省略項目なしオプション
 * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
 * @throws {TypeError} The `options.paddedLength` is not positive integer.
 * @throws {RangeError} The `options.paddedLength` is below the lower limit.
 */
function _resolveOptions(
  options: ByteFormat.Options | _ResolvedOptions = {},
): _ResolvedOptions {
  if (_isRadix(options.radix) || (options.radix === undefined)) {
    // ok
  }
  else {
    throw new TypeError("radix");
  }
  const radix: ByteFormat.Radix = _isRadix(options.radix) ? options.radix : 16;

  if (
    Integer.isPositiveInteger(options.paddedLength) ||
    (options.paddedLength === undefined)
  ) {
    // ok
  }
  else {
    throw new TypeError("paddedLength");
  }
  const minPaddedLength: int = _minPaddedLengthOf(radix);
  const paddedLength: int = Number.isSafeInteger(options.paddedLength)
    ? options.paddedLength as int
    : minPaddedLength;
  if (paddedLength < minPaddedLength) {
    throw new RangeError("paddedLength");
  }

  let lowerCase: boolean;
  if (typeof options.lowerCase === "boolean") {
    lowerCase = options.lowerCase;
  }
  else {
    lowerCase = false;
  }

  let prefix: string;
  if (typeof options.prefix === "string") {
    prefix = options.prefix;
  }
  else {
    prefix = "";
  }

  let suffix: string;
  if (typeof options.suffix === "string") {
    suffix = options.suffix;
  }
  else {
    suffix = "";
  }

  let separator: string;
  if (typeof options.separator === "string") {
    separator = options.separator;
  }
  else {
    separator = "";
  }

  return Object.freeze({
    radix,
    paddedLength,
    lowerCase,
    prefix,
    suffix,
    separator,
  });
}

/**
 * 1バイトを表す文字列を8-bit符号なし整数にパースし返却
 *
 * @param formatted 文字列
 * @returns 8-bit符号なし整数
 * @throws {TypeError} The `formatted` does not match the specified format.
 */
function _parseByte(
  formatted: string,
  options: _ResolvedOptions,
  byteRegex: RegExp,
): uint8 {
  let work = formatted;

  if (options.prefix.length > 0) {
    if (work.startsWith(options.prefix)) {
      work = work.substring(options.prefix.length);
    }
    else {
      throw new TypeError("unprefixed");
    }
  }

  if (options.suffix.length > 0) {
    if (work.endsWith(options.suffix)) {
      work = work.substring(0, work.length - options.suffix.length);
    }
    else {
      throw new TypeError("unsuffixed");
    }
  }

  if (byteRegex.test(work) !== true) {
    throw new TypeError(`parse error: ${work}`);
  }

  const integer = Number.parseInt(work, options.radix);
  // if (isUint8(integer)) {
  return integer as uint8; // regex.testがtrueならuint8のはず
  // }
  // else
}

/**
 * オプションどおりにフォーマットした1バイトを表す文字列にマッチする正規表現を生成
 *
 * @param resolvedOptions オプション
 * @returns オプションから生成した正規表現
 */
function _createByteRegex(resolvedOptions: _ResolvedOptions): RegExp {
  let charsPattern: string;
  switch (resolvedOptions.radix) {
  case 2:
    charsPattern = "[01]";
    break;
  case 8:
    charsPattern = "[0-7]";
    break;
  case 10:
    charsPattern = "[0-9]";
    break;
  case 16:
    charsPattern = "[0-9A-Fa-f]";
    break;
  }
  const bodyLength = _minPaddedLengthOf(resolvedOptions.radix);
  const paddingLength = resolvedOptions.paddedLength - bodyLength;
  const paddingPattern = (paddingLength > 0) ? `[0]{${paddingLength}}` : "";
  return new RegExp(`^${paddingPattern}${charsPattern}{${bodyLength}}$`);
}

/**
 * @param toParse
 * @param options
 * @param byteRegex
 * @returns
 * @throws {TypeError} The `toParse` contains the character sequence that does not match the specified format.
 */
function _parse(
  toParse: string,
  options: _ResolvedOptions,
  byteRegex: RegExp,
): Uint8Array {
  let byteStringArray: Array<string>;
  if (options.separator.length > 0) {
    byteStringArray = toParse.split(options.separator);
    if (byteStringArray.length === 1 && byteStringArray[0] === "") {
      return new Uint8Array(0);
    }
  }
  else {
    const elementLength = options.paddedLength + options.prefix.length +
      options.suffix.length;
    byteStringArray = StringUtils.segment(toParse, {
      count: elementLength,
      unit: StringUtils.Unit.CHAR,
    });
  }

  return Uint8Array.from(byteStringArray, (byteString) => {
    return _parseByte(byteString, options, byteRegex);
  });
}

/**
 * 8-bit符号なし整数を文字列にフォーマットし返却
 *
 * @param byte 8-bit符号なし整数
 * @param options オプション
 * @returns 文字列
 */
function _formatByte(byte: uint8, options: _ResolvedOptions): string {
  let str = byte.toString(options.radix);
  if (options.lowerCase !== true) {
    str = str.toUpperCase();
  }
  str = str.padStart(options.paddedLength, "0");
  return options.prefix + str + options.suffix;
}

function _format(bytes: Uint8Array, options: _ResolvedOptions): string {
  const byteStringArray = [ ...bytes ].map((byte) => {
    return _formatByte(byte as uint8, options);
  });
  return byteStringArray.join(options.separator);
}

namespace ByteFormat {
  /**
   * Parses the string that represents the byte sequence.
   *
   * @param toParse The string to parse.
   * @param options The `ByteFormat.Options` dictionary.
   * @returns An `Uint8Array` containing the parsed byte sequence.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   * @throws {TypeError} The `toParse` contains the character sequence that does not match the specified format.
   */
  export function parse(toParse: string, options?: Options): Uint8Array {
    const resolvedOptions = _resolveOptions(options);
    const byteRegex = _createByteRegex(resolvedOptions);
    return _parse(toParse, resolvedOptions, byteRegex);
  }

  /**
   * Formats the byte sequence into a string.
   *
   * @param bytes The byte sequence to format.
   * @param options The `ByteFormat.Options` dictionary.
   * @returns A string that represents the byte sequence.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   */
  export function format(bytes: Uint8Array, options?: Options): string {
    const resolvedOptions = _resolveOptions(options);
    return _format(bytes, resolvedOptions);
  }

  /**
   * 2, 8, 10, or 16.
   */
  export type Radix = typeof _radixes[number];

  /**
   * The object with the following optional fields.
   */
  export type Options = {
    /**
     * The radix of the formatted string.
     * 2, 8, 10, and 16 are available values.
     * The default is `16`.
     */
    radix?: Radix;

    /**
     * The length of the `"0"` padded formatted string for each byte.
     * The default is determined by `radix`.
     *
     * | `radix` | default of `paddedLength` |
     * | ---: | ---: |
     * | `16` | `2` |
     * | `10` | `3` |
     * | `8` | `3` |
     * | `2` | `8` |
     */
    paddedLength?: int;

    /**
     * Whether the formatted string is lowercase or not.
     * The default is `false`.
     */
    lowerCase?: boolean;

    /**
     * The prefix of the formatted string for each byte.
     * The default is `""`.
     */
    prefix?: string;

    /**
     * The suffix of the formatted string for each byte.
     * The default is `""`.
     */
    suffix?: string;

    /**
     * The separator between the formatted strings of each byte.
     * The default is `""`.
     */
    separator?: string;
  };

  export class Parser {
    /**
     * 未設定項目を埋めたオプション
     */
    #options: _ResolvedOptions;

    #byteRegex: RegExp; // "g"等を持たせないよう注意

    /**
     * @param options The `ByteFormat.Options` dictionary.
     * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
     * @throws {TypeError} The `options.paddedLength` is not positive integer.
     * @throws {RangeError} The `options.paddedLength` is below the lower limit.
     */
    constructor(options?: Options) {
      this.#options = _resolveOptions(options);
      this.#byteRegex = _createByteRegex(this.#options);
      Object.freeze(this);
    }

    /**
     * Parses the string that represents the byte sequence.
     *
     * @param toParse The string to parse.
     * @returns An `Uint8Array` containing the parsed byte sequence.
     * @throws {TypeError} The `toParse` contains the character sequence that does not match the specified format.
     */
    parse(toParse: string): Uint8Array {
      return _parse(toParse, this.#options, this.#byteRegex);
    }

    /**
     * Returns a `ByteFormat.Parser` object.
     *
     * @deprecated
     * @param options The `ByteFormat.Options` dictionary.
     * @returns An instance of `ByteFormat.Parser`.
     * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
     * @throws {TypeError} The `options.paddedLength` is not positive integer.
     * @throws {RangeError} The `options.paddedLength` is below the lower limit.
     */
    static get(options?: Options): Parser {
      const resolvedOptions = _resolveOptions(options);
      return new Parser(resolvedOptions);
    }
  }
  Object.freeze(Parser);

  export class Formatter {
    /**
     * 未設定項目を埋めたオプション
     */
    #options: _ResolvedOptions;

    /**
     * @param options The `ByteFormat.Options` dictionary.
     * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
     * @throws {TypeError} The `options.paddedLength` is not positive integer.
     * @throws {RangeError} The `options.paddedLength` is below the lower limit.
     */
    constructor(options?: Options) {
      this.#options = _resolveOptions(options);
      Object.freeze(this);
    }

    /**
     * Formats the byte sequence into a string.
     *
     * @param bytes The byte sequence to format.
     * @returns A string that represents the byte sequence.
     */
    format(bytes: Uint8Array): string {
      return _format(bytes, this.#options);
    }

    /**
     * Returns a `ByteFormat.Formatter` object.
     *
     * @deprecated
     * @param options The `ByteFormat.Options` dictionary.
     * @returns An instance of `ByteFormat.Formatter`.
     * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
     * @throws {TypeError} The `options.paddedLength` is not positive integer.
     * @throws {RangeError} The `options.paddedLength` is below the lower limit.
     */
    static get(options?: Options): Formatter {
      const resolvedOptions = _resolveOptions(options);
      return new Formatter(resolvedOptions);
    }
  }
  Object.freeze(Formatter);
}
Object.freeze(ByteFormat);

export { ByteFormat };
