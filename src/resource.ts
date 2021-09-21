//

// import { Exception, httpQuotedString, RangePattern } from "./_.js";
import { Exception, RangePattern } from "./_.js";
import { StringEx } from "./_/string_ex.js";
import { ByteSequence } from "./byte_sequence.js";
import { MediaType } from "./media_type.js";

/**
 * ファイル様オブジェクト
 */
class Resource {
  /**
   * メディアタイプ
   */
  #mediaType: MediaType;

  /**
   * バイト列
   */
  #bytes: ByteSequence;

  /**
   * @param mediaType メディアタイプ
   * @param bytes バイト列
   */
  protected constructor(mediaType: MediaType, bytes: ByteSequence) {
    this.#mediaType = mediaType;
    this.#bytes = bytes;
    // Object.freeze(this);
  }

  /**
   * メディアタイプ
   */
  get mediaType(): MediaType {
    return this.#mediaType;
  }

  /**
   * バイト列
   */
  get bytes(): ByteSequence {
    return this.#bytes;
  }

  /**
   * サイズ（バイト列のバイト数）
   */
  get size(): number {
    return this.#bytes.count;
  }

  /**
   * Blobからインスタンスを生成し返却
   * 
   * @param blob Blob
   * @returns 生成したインスタンス
   */
  static async fromBlob(blob: Blob): Promise<Resource> {
    try {
      const buffer = await blob.arrayBuffer(); // XXX Node.jsでもstream()を取得できるようになった
      let mediaType: MediaType;
      if (blob.type) {
        mediaType = MediaType.fromString(blob.type);
      }
      else {
        mediaType = MediaType.fromString("application/octet-stream");
      }
      const bytes = new ByteSequence(buffer);

      return new Resource(mediaType, bytes);
    }
    catch (exception) {
      // NotFoundError | SecurityError | NotReadableError
      const causes = [];
      if (exception instanceof Error) {
        causes.push(exception);
      }
      throw new Exception("Error", "reading failed", causes);
    }
  }

  /**
   * 自身のメディアタイプとバイト列からBlobを生成し返却
   * 
   * @returns Blob
   */
  toBlob(): Blob {
    return new Blob([ this.#bytes.buffer ], {
      type: this.#mediaType.toString(),
    });
  }

  /**
   * Data URLからインスタンスを生成し返却
   * 
   * {@link https://fetch.spec.whatwg.org/#data-urls Fetch Standard}の仕様に従った。
   * 最初に出現した","をメディアタイプとデータの区切りとみなす。（メディアタイプのquotedなパラメーター値に含まれた","とみなせる場合であっても区切りとする）
   * クエリはデータの一部とみなす。
   * 
   * @experimental
   * @param dataUrl Data URL
   * @returns 生成したインスタンス
   */
  static fromDataURL(dataUrl: URL | string): Resource {
    const uri: URL = new URL(dataUrl);

    // 1 
    if (uri.protocol !== "data:") {
      throw new TypeError("dataUrl");
    }

    // 2
    uri.hash = "";

    // 3, 4
    let bodyStringWork = uri.toString().substring(5);

    // 5, 6, 7
    if (bodyStringWork.includes(",") !== true) {
      throw new Exception("DataError", "U+002C not found");
    }

    const mediaTypeOriginal = bodyStringWork.split(",")[0] as string;
    let mediaTypeWork = StringEx.trim(mediaTypeOriginal, RangePattern.ASCII_WHITESPACE);

    // 8, 9
    bodyStringWork = bodyStringWork.substring(mediaTypeOriginal.length + 1);

    // 10
    let bodyWork = ByteSequence.fromPercent(bodyStringWork);

    // 11
    const base64Indicator = /;[\u0020]*base64$/i;
    const base64: boolean = base64Indicator.test(mediaTypeWork);
    if (base64 === true) {
      // 11.1
      bodyStringWork = bodyWork.toBinaryString();

      // 11.2, 11.3
      bodyWork = ByteSequence.fromBase64(bodyStringWork, { forgiving: true });

      // 11.4, 11.5, 11.6
      mediaTypeWork = mediaTypeWork.replace(base64Indicator, "");
    }

    // 12
    if (mediaTypeWork.startsWith(";")) {
      mediaTypeWork = "text/plain" + mediaTypeWork;
    }

    // 13, 14
    let mediaType: MediaType;
    try {
      mediaType = MediaType.fromString(mediaTypeWork);
    }
    catch (exception) {
      void exception;
      mediaType = MediaType.fromString("text/plain;charset=US-ASCII");
    }

    return new Resource(mediaType, bodyWork);
  }

  /**
   * 自身のメディアタイプとバイト列からData URLを生成し返却
   * 
   * FileReaderの仕様に倣い、テキストかどうかに関係なく常時base64エンコードする。
   * //XXX %エンコードもできるようにする？
   * 
   * @experimental
   * @returns Data URL
   */
  toDataUrl(): URL {
    const encoding = ";base64";
    const dataEncoded = this.#bytes.toBase64();

    return new URL("data:" + this.#mediaType.toString() + encoding + "," + dataEncoded);
  }

  /**
   * Computes the SRI integrity (base64-encoded digest).
   * 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity}
   * @param algorithmName The name of the digest algorithm.
   * @returns The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise Promise} that
   *     fulfills with a SRI integrity (base64-encoded digest).
   */
  async integrity(algorithmName: string): Promise<string> {
    let prefix = "";
    switch (algorithmName.toLowerCase()) {
    case "sha-256":
      prefix = "sha256-";
      break;
    case "sha-384":
      prefix = "sha384-";
      break;
    case "sha-512":
      prefix = "sha512-";
      break;
    }
    if (prefix.length <= 0) {
      throw new Exception("NotSupportedError", "algorithmName:" + algorithmName);
    }

    const digestBytes = await this.#bytes.toDigest(algorithmName);
    return prefix + digestBytes.toBase64();
  }


  // static async fromWebMessage(message: Request | Response, options: WebMessageReadingOptions): Promise<Resource> {
  //   if (message.body !== null) {
  //     //XXX Responseの場合、status等は無視？

  //     if (options.readAs === "blob") {
  //       const blob = await message.blob();
  //       return Resource.fromBlob(blob);
  //     }

  //     const mediaType = extractContentType(message.headers);
  //     if (message.body !== null) {
  //       //const size = extractContentLength(message.headers);
  //       //XXX sizeがそのまま使える場合は限られる
  //       const bytes = await ByteSequence.fromByteStream(message.body);
  //       return new Resource(mediaType, bytes);
  //     }
  //   }
  //   throw new Exception("DataError", "no message body");
  // }

}
Object.freeze(Resource);


// type WebMessageReadingOptions = {
//   readAs: "blob" | "stream",
// };

// /**
//  * RequestまたはResponseのヘッダーからContent-Typeの値を取得し返却する
//  * 
//  * {@link https://fetch.spec.whatwg.org/#content-type-header Fetch standard}の仕様に合わせた
//  * 
//  * @param headers ヘッダー
//  * @returns Content-Typeの値から生成したMediaTypeインスタンス
//  */
// function extractContentType(headers: Headers): MediaType {
//   // 5.
//   if (headers.has("Content-Type") !== true) {
//     throw new Exception("NotFoundError", "Content-Type header");
//   }

//   // 4, 5.
//   const typesString = headers.get("Content-Type") as string;
//   const typeStrings = splitWebHeaderValue(typesString);
//   if (typeStrings.length <= 0) {
//     throw new Exception("NotFoundError", "Content-Type value");
//   }

//   // 1, 2, 3.
//   let textEncoding: string = "";
//   let mediaTypeEssence: string = "";
//   let mediaType: MediaType | null = null;
//   // 6.
//   for (const typeString of typeStrings) {
//     try {
//       // 6.1.
//       const tempMediaType = MediaType.fromString(typeString);

//       // 6.3.
//       mediaType = tempMediaType;

//       // 6.4.
//       if (mediaTypeEssence !== mediaType.essence) {
//         // 6.4.1.
//         textEncoding = "";
//         // 6.4.2.
//         if (mediaType.hasParameter("charset")) {
//           textEncoding = mediaType.getParameterValue("charset") as string;
//         }
//         // 6.4.3.
//         mediaTypeEssence = mediaType.essence;
//       }
//       else {
//         // 6.5.
//         if ((mediaType.hasParameter("charset") !== true) && (textEncoding !== "")) {
//           //TODO mediaType.withParameters()
//         }
//       }
//     }
//     catch (exception) {
//       console.log(exception)//TODO 消す
//       // 6.2. "*/*"はMediaType.fromStringでエラーにしている
//       continue;
//     }
//   }

//   // 7, 8.
//   if (mediaType !== null) {
//     return mediaType;
//   }
//   else {
//     throw new Exception("Error", "extraction failure");
//   }
// }

// /**
//  * Headers#getで取得した値を分割する
//  * （複数ヘッダーだった場合、","で連結されているので分割する）
//  * 
//  * かつてはHeaders#getAllすれば良かったが、それは廃止されたので
//  * {@link https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split} のsplitの部分の仕様で分割する
//  * 
//  * @param value Headers#getで取得した値
//  * @returns 分割結果
//  */
// function splitWebHeaderValue(value: string): Array<string> {
//   const notU0022OrU002C = "\\u0022\\u002C";
//   const values: Array<string> = [];
//   let work = value;
//   while (work.length > 0) {
//     let splitted = StringEx.collectStart(work, notU0022OrU002C);
//     work = work.substring(splitted.length);
//     if (work.startsWith("\u0022")) {
//       const result = httpQuotedString(work);
//       splitted = splitted + result.value;
//       work = work.substring(result.length);
//     }
//     else { // work.startsWith("\u002C")
//       work = work.substring(1);
//     }
//     values.push(StringEx.trim(splitted, RangePattern.HTTP_TAB_OR_SPACE));
//   }
//   return values;
// }

// /**
//  * RequestまたはResponseのヘッダーからContent-Lengthの値を取得し返却する
//  * 
//  * {@link https://fetch.spec.whatwg.org/#content-length-header Fetch standard}の仕様に合わせた
//  * 
//  * @param headers ヘッダー
//  * @returns Content-Lengthの値から生成した数値、取得できなかった場合はnull
//  */
// function extractContentLength(headers: Headers): number | null {
//   // 2.
//   if (headers.has("Content-Length") !== true) {
//     return null;
//   }

//   // 1, 2.
//   const sizesString = headers.get("Content-Length") as string;
//   const sizeStrings = splitWebHeaderValue(sizesString);
//   if (sizeStrings.length <= 0) {
//     return null;
//   }

//   // 3.
//   let candidateValue: string | null = null;
//   // 4.
//   for (const sizeString of sizeStrings) {
//     // 4.1.
//     if (candidateValue === null) {
//       candidateValue = sizeString;
//     }
//     else {
//       // 4.2.
//       throw new Exception("DataError", "duplicate Content-Length");
//     }
//   }
//   candidateValue = candidateValue as string;

//   // 5.
//   if (/^[0-9]+$/.test(candidateValue) !== true) {
//     return null;
//   }
//   // 6.
//   return Number.parseInt(candidateValue, 10);
// }

export { Resource };
