import { _Blob, _crypto, _ProgressEvent, Http, MediaType } from "../deps.ts";

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
  export function createHeaders(init?: HeadersInit): HeadersInit {
    const headers = new Headers(init);

    // Content-Type
    // init.headersで指定されていれば、それを指定
    try {
      const mediaType = MediaType.fromHeaders(headers);
      headers.set(Http.Header.CONTENT_TYPE, mediaType.toString());
    } catch (exception) {
      void exception;
      headers.delete(Http.Header.CONTENT_TYPE);
    }

    // Content-Length
    // 何もしない

    //return [...headers.entries()]; // Node.jsの HeadersInitにHeadersは含まれない
    // dntでbuildできないので
    return [
      ...(headers as unknown as {
        entries: () => IterableIterator<[string, string]>;
      }).entries(),
    ];
  }
}
Object.freeze(_HttpUtilsEx);

export { _HttpUtilsEx, _Utf8 };
