//

// メディア

import { Exception, getBlobConstructor, trimAsciiSpace } from "../_";
import { ByteSequence } from "../byte_sequence";
import { Uri } from "../uri";
import { MediaType } from "./media_type";

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
      throw new Exception("Error", "reading failed", exception);
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

  // TODO
  /**
   * 自身のメディアタイプとバイト列からData URLを生成し返却
   * 
   * Base64符号化が必要か否かの判断は呼び出す側の責任において行うこと。
   * 
   * @experimental
   * @param base64 バイト列をBase64符号化するか否か
   * @returns Data URL
   */
  // toDataUrl(base64 = true): Uri {
  //   let encoding = "";
  //   let dataText = "";
  //   if (base64 === true) {
  //     encoding = ";base64";
  //     dataText = this.toBase64();
  //   }
  //   else {
  //     dataText = this.toPercent({ TODO });
  //   }

  //   return "data:" + this.#mediaType.toString() + encoding + "," + dataText;
  // }

  // fromRespomse
  // toRequest
}
Object.freeze(FileLike);

export { FileLike };
