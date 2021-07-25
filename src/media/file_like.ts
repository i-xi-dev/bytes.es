//

// メディア

import { Exception, getBlobConstructor } from "../_";
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
   * @experimental
   * @param dataUrl Data URL
   * @returns 生成したインスタンス
   */
  static fromDataUrl(dataUrl: string): FileLike {
    if (/^data:/i.test(dataUrl) !== true) {
      throw new TypeError("dataUrl");
    }

    let work = dataUrl.substring(5);
    const mediaType = MediaType.fromString(work, true);
    work = work.substring(mediaType.originalString.length);
    let encoded: string;
    let bytes: ByteSequence;
    if (work.startsWith(";base64,")) {
      encoded = work.substring(8);
      bytes = ByteSequence.fromBase64(encoded);
    }
    else if (work.startsWith(",")) {
      encoded = work.substring(1);
      bytes = ByteSequence.fromPercent(encoded);
    }
    else {
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
}
Object.freeze(FileLike);

export { FileLike };
