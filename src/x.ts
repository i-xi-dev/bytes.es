import { Byte, type byte, HttpUtils, MediaType, StringUtils } from "./deps.ts";

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

namespace _ArrayBufferView {
  export function isTypedArrayConstructor(
    value: unknown,
  ): value is (
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    | Int8ArrayConstructor
    | Uint16ArrayConstructor
    | Int16ArrayConstructor
    | Uint32ArrayConstructor
    | Int32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor
    | BigUint64ArrayConstructor
    | BigInt64ArrayConstructor
  ) {
    return ((value === Uint8Array) || (value === Uint8ClampedArray) ||
      (value === Int8Array) || (value === Uint16Array) ||
      (value === Int16Array) || (value === Uint32Array) ||
      (value === Int32Array) || (value === Float32Array) ||
      (value === Float64Array) || (value === BigUint64Array) ||
      (value === BigInt64Array));
  }

  export function isDataViewConstructor(
    value: unknown,
  ): value is DataViewConstructor {
    return value === DataView;
  }

  export type Constructor<T> = {
    new (a: ArrayBuffer, b?: number, c?: number): T;
  };
}
Object.freeze(_ArrayBufferView);

namespace _Uint8Utils {
  export function isArrayOfUint8(value: unknown): value is Array<byte> {
    if (Array.isArray(value)) {
      return value.every((i) => Byte.isByte(i));
    }
    return false;
  }
}
Object.freeze(_Uint8Utils);

namespace _Iterable {
  export function toArray<T>(iterable: Iterable<T>): Array<T> {
    if (Array.isArray(iterable)) {
      return iterable as Array<T>;
    }
    if (iterable && iterable[Symbol.iterator]) {
      return [...iterable];
    }
    throw new TypeError("iterable");
  }
}
Object.freeze(_Iterable);

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

  /**
   * RequestまたはResponseのヘッダーからContent-Typeの値を取得し返却する
   *
   * {@link https://fetch.spec.whatwg.org/#content-type-header Fetch standard}の仕様に合わせた
   * (await Body.blob()).type と同じになるはず？
   *
   * @param headers ヘッダー
   * @returns Content-Typeの値から生成したMediaTypeインスタンス
   */
  export function extractContentType(headers: Headers): MediaType {
    // 5.
    if (headers.has("Content-Type") !== true) {
      throw new Error("Content-Type field not found");
    }

    // 4, 5.
    const typesString = headers.get("Content-Type") as string;
    const typeStrings = splitHeaderValue(typesString);
    if (typeStrings.length <= 0) {
      throw new Error("Content-Type value not found");
    }

    // 1, 2, 3.
    let textEncoding = "";
    let mediaTypeEssence = "";
    let mediaType: MediaType | null = null;
    // 6.
    for (const typeString of typeStrings) {
      try {
        // 6.1.
        const tempMediaType = MediaType.fromString(typeString);

        // 6.3.
        mediaType = tempMediaType;

        // 6.4.
        if (mediaTypeEssence !== mediaType.essence) {
          // 6.4.1.
          textEncoding = "";
          // 6.4.2.
          if (mediaType.hasParameter("charset")) {
            textEncoding = mediaType.getParameterValue("charset") as string;
          }
          // 6.4.3.
          mediaTypeEssence = mediaType.essence;
        } else {
          // 6.5.
          if (
            (mediaType.hasParameter("charset") !== true) &&
            (textEncoding !== "")
          ) {
            // TODO mediaType.withParameters()
          }
        }
      } catch (exception) {
        console.log(exception); // TODO 消す
        // 6.2. "*/*"はMediaType.fromStringでエラーにしている
        continue;
      }
    }

    // 7, 8.
    if (mediaType !== null) {
      return mediaType;
    } else {
      throw new Error("extraction failure");
    }
  }

  export function createHeaders(init?: HeadersInit): HeadersInit {
    const headers = new Headers(init);

    // Content-Type
    // init.headersで指定されていれば、それを指定
    try {
      const mediaType = extractContentType(headers);
      headers.set(_Http.Header.CONTENT_TYPE, mediaType.toString());
    } catch (exception) {
      void exception;
      headers.delete(_Http.Header.CONTENT_TYPE);
    }

    // Content-Length
    // 何もしない

    return [...headers.entries()]; // Node.jsの HeadersInitにHeadersは含まれない
  }
}
Object.freeze(_HttpUtilsEx);

export { _ArrayBufferView, _Http, _HttpUtilsEx, _Iterable, _Uint8Utils, _Utf8 };
