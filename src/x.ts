import { Byte, type byte, HttpUtils, StringUtils } from "./deps.ts";

namespace _Http {
  export const Header = {
    CONTENT_ENCODING: "Content-Encoding",
    CONTENT_LANGUAGE: "Content-Language",
    CONTENT_LENGTH: "Content-Length",
    CONTENT_LOCATION: "Content-Location",
    CONTENT_TYPE: "Content-Type",
  } as const;

  export const Method = {
    CONNECT: "CONNECT",
    DELETE: "DELETE",
    GET: "GET",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    PATCH: "PATCH",
    POST: "POST",
    PUT: "PUT",
    TRACE: "TRACE",
  } as const;
}
Object.freeze(_Http);

namespace _Uint8Utils {
  export function isArrayOfUint8(value: unknown): value is Array<byte> {
    if (Array.isArray(value)) {
      return value.every((i) => Byte.isByte(i));
    }
    return false;
  }
}
Object.freeze(_Uint8Utils);

let _utf8TextEncoder: TextEncoder;
let _utf8TextDecoder: TextDecoder;

namespace _Utf8 {
  export function getEncoder(): TextEncoder {
    if ((_utf8TextEncoder instanceof TextEncoder) !== true) {
      _utf8TextEncoder = new TextEncoder();
    }
    return _utf8TextEncoder;
  }

  export function getDecoder(): TextDecoder {
    if ((_utf8TextDecoder instanceof TextDecoder) !== true) {
      _utf8TextDecoder = new TextDecoder("utf-8", {
        fatal: true,
        ignoreBOM: true,
      });
    }
    return _utf8TextDecoder;
  }
}
Object.freeze(_Utf8);

namespace _HttpUtilsEx {
  /**
   * Headers#getで取得した値を分割する
   * （複数ヘッダーだった場合、","で連結されているので分割する）
   *
   * かつてはHeaders#getAllすれば良かったが、それは廃止されたので。
   *  → Headers#getは引用符を問答無用で消してしまう（","が引用符の中にあったのか外にあったのか不明になる）
   *    ので、元の値は取得不能ですね…（getAllの再現は不可能）
   *
   * {@link https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split} のsplitの部分の仕様で分割する
   *
   * @param value Headers#getで取得した値
   * @returns 分割結果
   */
  export function splitHeaderValue(value: string): Array<string> {
    const u0022OrU002C = "[\\u{22}\\u{2C}]+";
    const values: Array<string> = [];

    if (/[\u0022\u002C]/.test(value) !== true) {
      const trimmed = StringUtils.trim(
        value,
        HttpUtils.Pattern.HTTP_TAB_OR_SPACE,
      );
      if (trimmed.length > 0) {
        return [trimmed];
      } else {
        return [];
      }
    }

    let i = 0;
    let vEnd = false;
    let cc = 0;
    let v = "";
    while (i < value.length) {
      const collected = StringUtils.collectStart(
        value.substring(i),
        u0022OrU002C,
      );
      i = i + collected.length;
      v = v + collected;
      const remains = value.substring(i);
      if (remains.startsWith("\u0022")) {
        const result = HttpUtils.collectHttpQuotedString(remains);
        v = v + remains.substring(0, result.progression);
        i = i + result.progression;
        if (result.following === true) {
          continue;
        }
      } else {
        //  または ","始まり
        i = i + 1;
        vEnd = true;
        if (remains.startsWith("\u002C")) {
          cc = cc + 1;
        }
      }

      if (vEnd === true) {
        values.push(StringUtils.trim(v, HttpUtils.Pattern.HTTP_TAB_OR_SPACE));
        v = "";
        vEnd = false;
      }
    }
    if (v !== "") {
      values.push(StringUtils.trim(v, HttpUtils.Pattern.HTTP_TAB_OR_SPACE));
    }
    if (values.length < (cc + 1)) {
      // 末尾が","だった場合 //XXX スマートに（cc不要に）できるのでは？
      values.push("");
    }

    return values;
  }
}
Object.freeze(_HttpUtilsEx);

export { _Http, _HttpUtilsEx, _Uint8Utils, _Utf8 };
