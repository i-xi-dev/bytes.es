
import { Exception } from "../../_";
import { isByte, uint8 } from "../type";
import { ByteFormat } from "../format";
import { ByteEncoding, ByteEncodingImpl, ByteEncodingOptions } from "./index";

/**
 * パーセント符号化方式オプション
 */
export type PercentEncodingOptions = ByteEncodingOptions & {
  /** 追加で"%XX"への変換対象とするバイトの配列 */
  inclusions?: Array<uint8>,
  /**
   * inclusionsに0x20が含まれているときに、0x20を"+"に符号化するか否か
   *     inclusionsに0x20が含まれていなければ無視する
   *     trueにするときは、inclusionsに"+"(0x2B)を追加する必要がある
   */
  spaceAsPlus?: boolean,
  /**
   * デコード時、パーセント符号化方式オプションに合致しない文字列が出現した場合エラーにするか否か
   *     ※エンコードには影響しない
   *     ※strict=falseでのデコード結果は、同じオプションで再エンコードしても元に戻らない可能性あり
   *     ※strict=falseの場合、デコード結果のlengthとbuffer.lengthが一致しなくなる可能性あり
   */
  strict?: boolean,
};

/**
 * パーセント符号化方式
 *     0x20～0x7E(0x25を除く)は、オプションのinclusionsで指定されていなければ"%XX"に変換しないことに注意。
 *     すなわち、URLエンコードとして使用するにはURLコンポーネントに応じて変換対象を追加する必要がある。
 */
class PercentEncoding implements ByteEncodingImpl {
  /**
   * 追加で"%XX"への変換対象とするバイトの配列のデフォルト
   */
  static readonly #DEFAULT_INCLUSIONS: ReadonlyArray<uint8> = [];

  /**
   * 0x20を"+"に符号化するか否かのデフォルト
   */
  static readonly #DEFAULT_SPACE_AS_PLUS: boolean = false;

  /**
   * デコード時、パーセント符号化方式オプションに合致しない文字列が出現した場合エラーにするか否かのデフォルト
   */
  static readonly #DEFAULT_STRICT: boolean = true;

  /**
   * "%XX"のフォーマッター
   */
  static readonly #byteFormatter = ByteFormat.for("hexadecimal", {
    upperCase: true,
    prefix: "%",
  });

  /**
   * 追加で"%XX"への変換対象とするバイトの配列
   */
  #inclusions: Array<uint8>;

  /**
   * 0x20を"+"に符号化するか否か
   */
  #spaceAsPlus: boolean;

  /**
   * デコード時、パーセント符号化方式オプションに合致しない文字列が出現した場合エラーにするか否か
   */
  #strict: boolean;

  /**
   * @param options パーセント符号化方式オプション
   */
  constructor(options: PercentEncodingOptions = {}) {
    let inclusions: Array<uint8>;
    if (Array.isArray(options.inclusions)) {
      if (options.inclusions.every((byte) => isByte(byte))) {
        inclusions = options.inclusions;
      }
      else {
        throw new TypeError("options.inclusions");
      }
    }
    else {
      inclusions = [ ...PercentEncoding.#DEFAULT_INCLUSIONS ];
    }
    const spaceAsPlus: boolean = (typeof options.spaceAsPlus === "boolean") ? options.spaceAsPlus : PercentEncoding.#DEFAULT_SPACE_AS_PLUS;
    if ((spaceAsPlus === true) && (inclusions.includes(0x2B) !== true)) {
      throw new TypeError("options.inclusions, options.spaceAsPlus");
    }
    const strict: boolean = (typeof options.strict === "boolean") ? options.strict : PercentEncoding.#DEFAULT_STRICT;

    this.#inclusions = inclusions.slice(0);
    this.#spaceAsPlus = spaceAsPlus;
    this.#strict = strict;
    Object.freeze(this);
  }

  /**
   * "%XX"への変換対象バイトか否かを返却
   * @param byte バイト
   * @returns "%XX"への変換対象バイトか否か
   */
  #isTarget(byte: uint8): boolean {
    // byteがUS-ASCIIの制御文字のコードポイントの場合、または、
    // byteが0x25の場合、または、
    // byteがinclusionsに含まれる場合、
    // "%XX"への変換対象
    return ((byte < 0x20) || (byte > 0x7E) || (byte === 0x25) || this.#inclusions.includes(byte));
  }

  /**
   * パーセント符号化された文字列から、"%XX"の形にエンコードされているバイトの数を取得する正規表現を生成し返却
   * @returns パーセント符号化された文字列から、"%XX"の形にエンコードされているバイトの数を取得する正規表現
   */
  #encodedPattern(): RegExp {
    const inclusionsStr = this.#inclusions.map((i) => i.toString(16)).join("|");
    let pattern = "%([0189a-f][0-9a-f]|25|7f";
    if (inclusionsStr.length > 0) {
      pattern = pattern + "|" + inclusionsStr;
    }
    pattern = pattern + ")";
    return new RegExp(pattern, "gi");
  }

  /**
   * 文字列をバイト列にパーセント復号し、結果のバイト列を返却
   * @param encoded パーセント符号化された文字列
   * @returns バイト列
   */
  decode(encoded: string): Uint8Array {
    if (/^[\u0020-\u007E]*$/.test(encoded) !== true) {
      throw new Exception("EncodingError", "decode error (1)");
    }

    const encodedCount = [ ...encoded.matchAll(this.#encodedPattern()) ].length;
    const decoded = new Uint8Array(encoded.length - (encodedCount * 3) + encodedCount);

    const spaceAsPlusEnabled = (this.#spaceAsPlus === true) && this.#inclusions.includes(0x20);

    let i = 0;
    let j = 0;
    while (i < encoded.length) {
      const c = encoded.charAt(i);

      let byte: uint8;
      if (c === "%") {
        const byteString = encoded.substring((i + 1), (i + 3));
        if (/^[0-9A-Fa-f]{2}$/.test(byteString) !== true) {
          throw new Exception("EncodingError", "decode error (2)");
        }
        byte = Number.parseInt(byteString, 16) as uint8;

        if (this.#isTarget(byte)) {
          i = i + 3;
        }
        else {
          if (this.#strict === true) {
            throw new Exception("EncodingError", "decode error (3)");
          }
          i = i + 3;
        }
      }
      else if (c === "+") {
        if (spaceAsPlusEnabled === true) {
          byte = 0x20;
        }
        else {
          byte = 0x2B;// c.charCodeAt(0) as uint8;
        }
        i = i + 1;
      }
      else {
        byte = c.charCodeAt(0) as uint8;
        i = i + 1;
      }

      decoded[j++] = byte;
    }

    if (decoded.length > j) {
      return decoded.subarray(0, j);
    }
    return decoded;
  }

  /**
   * バイト列を文字列にパーセント符号化し、結果の文字列を返却
   * @param toEncode バイト列
   * @returns パーセント符号化された文字列
   */
  encode(toEncode: Uint8Array): string {
    let work: Array<uint8> = [];
    let encoded = "";
    for (const byte of toEncode) {
      if (this.#isTarget(byte as uint8)) {
        if (byte === 0x20) {
          if (this.#spaceAsPlus === true) {
            encoded = encoded + PercentEncoding.#byteFormatter.format(Uint8Array.from(work)) + "+";
            work = [];
          }
          else {
            work.push(byte);
          }
        }
        else {
          work.push(byte as uint8);
        }
      }
      else {
        // 上記以外はbinary stringと同じ
        encoded = encoded + PercentEncoding.#byteFormatter.format(Uint8Array.from(work)) + String.fromCharCode(byte);
        work = [];
      }
    }
    encoded = encoded + PercentEncoding.#byteFormatter.format(Uint8Array.from(work));
    return encoded;
  }
}
Object.freeze(PercentEncoding);

ByteEncoding.register("percent", PercentEncoding);
