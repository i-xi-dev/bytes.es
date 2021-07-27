//

// メディア

import { Exception, getBlobConstructor, trimAsciiSpace } from "../_";
import { ByteSequence } from "../byte_sequence";
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
   * TODO https://fetch.spec.whatwg.org/#data-urls に合っていない点を合わせる（mediatype省略時、charset初期値、base64前後のスペース）
   * 
   * {@link https://fetch.spec.whatwg.org Fetch Standard}の仕様に従った。
   * 最初に出現した","をメディアタイプとデータの区切りとみなす。（メディアタイプのquotedなパラメーター値に含まれた","とみなせる場合であっても区切りとする）
   * 
   * @experimental
   * @param dataUrl Data URL
   * @returns 生成したインスタンス
   */
  static fromDataUrl(dataUrl: string): FileLike {
    if (/^data:/i.test(dataUrl) !== true) {
      throw new TypeError("dataUrl");
    }

    let work = dataUrl.substring(5);
    let mediaType: MediaType;

    if (work.includes(",") !== true) {
      throw new Exception("DataError", "U+002C not found");
    }

    let mediaTypeOriginal = work.split(",")[0] as string;
    if (mediaTypeOriginal.endsWith(";base64")) {//TODO 末尾スペースでもok
      mediaTypeOriginal = mediaTypeOriginal.substring(0, mediaTypeOriginal.length - 7);
    }
    mediaTypeOriginal = trimAsciiSpace(mediaTypeOriginal);

    mediaType = MediaType.fromString(mediaTypeOriginal);
    work = work.substring(mediaTypeOriginal.length);

    let encoded: string;
    let bytes: ByteSequence;
    if (work.startsWith(";base64,")) {
      encoded = work.substring(8);
      bytes = ByteSequence.fromBase64(encoded);
    }
    else if (work.startsWith(",")) {
      encoded = work.substring(1);
      bytes = ByteSequence.fromPercent(encoded, {
        strict: false,
        caseInsensitive: true,
      });
    }
    else {
      // ","がメディアタイプに後続していない場合
      throw new Exception("DataError", "parsing error");
    }

    return new FileLike(mediaType, bytes);
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
  // toDataUrl(base64 = true): string {
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
