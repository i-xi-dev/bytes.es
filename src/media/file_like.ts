//

// メディア

import { Exception, getBlobConstructor, trimAsciiSpace } from "../_.js";
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

  // fromWebRespomse
  // toWebRequest
}
Object.freeze(FileLike);

export { FileLike };
