//

// import { collectStart, Exception, httpQuotedString, splitWebHeaderValue, trimAsciiSpace, trimHttpTabOrSpace } from "../_.js";
import { Exception,  trimAsciiSpace  } from "../_.js";
import { getBlobConstructor } from "../_/compat.js";
import { ByteSequence } from "../byte_sequence.js";
import { Uri } from "../uri.js";
import { MediaType } from "./media_type.js";

/**
 * ファイル様オブジェクト
 */
class FileLike {
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
  static async fromBlob(blob: Blob): Promise<FileLike> {
    try {
      const buffer = await blob.arrayBuffer();
      let mediaType: MediaType;
      if (blob.type) {
        mediaType = MediaType.fromString(blob.type);
      }
      else {
        mediaType = MediaType.fromString("application/octet-stream");
      }
      const bytes = new ByteSequence(buffer);

      return new FileLike(mediaType, bytes);
    }
    catch (exception) {
      // NotFoundError | SecurityError | NotReadableError
      throw new Exception("Error", "reading failed", [ exception ]);
    }
  }

  /**
   * 自身のメディアタイプとバイト列からBlobを生成し返却
   * 
   * @returns Blob
   */
  toBlob(): Blob {
    const Blob = getBlobConstructor();
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
  static fromDataUrl(dataUrl: Uri | string): FileLike {
    let uri: Uri;
    if (dataUrl instanceof Uri) {
      uri = dataUrl;
    }
    else {
      uri = new Uri(dataUrl);
    }

    // 1
    if (uri.scheme !== "data") {
      throw new TypeError("dataUrl");
    }

    // 2
    uri = uri.withoutFragment();

    // 3, 4
    let bodyStringWork = uri.toString().substring(5);

    // 5, 6, 7
    if (bodyStringWork.includes(",") !== true) {
      throw new Exception("DataError", "U+002C not found");
    }

    const mediaTypeOriginal = bodyStringWork.split(",")[0] as string;
    let mediaTypeWork = trimAsciiSpace(mediaTypeOriginal);

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

    return new FileLike(mediaType, bodyWork);
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
  toDataUrl(): Uri {
    const encoding = ";base64";
    const dataEncoded = this.#bytes.toBase64();

    return new Uri("data:" + this.#mediaType.toString() + encoding + "," + dataEncoded);
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

  // TODO
  // static async fromWebMessage(message: Request | Response, options) {
  //   // message.bodyで取得するので、ヘッダーからContent-TypeとContent-Lengthを抽出（blob()で取得するなら抽出する必要は無い TODO 選択可能にする？）
  //   const mediaType = declaredContentType(message.headers);
  //   const size = declaredContentLength(message.headers);
  //   // Content-Encodingされてる場合にサイズが取れない
  // }


}
Object.freeze(FileLike);

// // https://fetch.spec.whatwg.org/#content-length-header
// function declaredContentLength(headers: Headers): number | null {
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
//       throw new Exception("TODO", "TODO");
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

// // https://fetch.spec.whatwg.org/#content-type-header
// function declaredContentType(headers: Headers): MediaType {
//   // 5.
//   if (headers.has("Content-Type") !== true) {
//     throw new Exception("TODO", "TODO");
//   }

//   // 4, 5.
//   const typesString = headers.get("Content-Type") as string;
//   const typeStrings = splitWebHeaderValue(typesString);
//   if (typeStrings.length <= 0) {
//     throw new Exception("TODO", "TODO");
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
//     throw new Exception("TODO", "TODO");
//   }
// }

export { FileLike };
