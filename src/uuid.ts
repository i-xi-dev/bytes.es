//

import { ByteSequence } from "./byte_sequence.js";
import { Uri } from "./uri.js";

/**
 * UUID
 * 
 * Implements version 4 UUID and Nil UUID.
 * Instances of this class are immutable.
 * 
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4122 RFC 4122}
 */
class Uuid {
  /**
   * 128-bit value as byte sequence.
   */
  #bytes: ByteSequence;

  /**
   * @param bytes 128ビット（16バイト）のバイト列
   */
  private constructor(bytes: ByteSequence) {
    if (bytes.count !== 16) {
      throw new TypeError("bytes");
    }

    this.#bytes = bytes.clone();
    Object.freeze(this);
  }

  /**
   * @returns A new instance that represents the nil UUID.
   */
  static nil(): Uuid {
    return new Uuid(ByteSequence.create(16));
  }

  /**
   * @returns A new instance that represents the version 4 UUID.
   */
  static generateRandom(): Uuid {
    const randomBytes = ByteSequence.generateRandom(16);

    // フィールド3の先頭4ビット（7バイト目の上位4ビット）は0100₂固定（13桁目の文字列表現は"4"固定）
    const field3 = randomBytes.view(6, 2);
    field3[0] = (field3[0] as number) & 0x0F | 0x40;

    // フィールド4の先頭2ビット（9バイト目の上位2ビット）は10₂固定（17桁目の文字列表現は"8","9","A","B"のどれか）
    const field4 = randomBytes.view(8, 2);
    field4[0] = (field4[0] as number) & 0x3F | 0x80;

    return new Uuid(randomBytes);
  }

  /**
   * UUIDの文字列表現からインスタンスを生成し返却
   *     RFC 4122にのっとり入力の大文字小文字を区別しない
   * 
   * @param uuidString UUIDの文字列表現
   * @returns 生成したインスタンス
   */
  static parse(uuidString: string): Uuid {
    if (/^(urn:uuid:)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuidString) !== true) {
      throw new TypeError("uuidString");
    }
    const str = (uuidString.length === 45) ? uuidString.substring(9) : uuidString;
    const bytes = ByteSequence.parse(str.replaceAll("-", "").toLowerCase());
    return new Uuid(bytes);
  }

  /**
   * 自身のUUIDの文字列表現を返却
   *     RFC 4122にのっとり小文字で出力する
   * 
   * @returns UUIDの文字列表現
   */
  format(): string {
    const uuidString = this.#bytes.format();
    return uuidString.substring(0, 8) + "-" + uuidString.substring(8, 12) + "-" + uuidString.substring(12, 16) + "-" + uuidString.substring(16, 20) + "-" + uuidString.substring(20);
  }

  /**
   * 自身のUUIDと、他のオブジェクトの表すUUIDが等しいか否かを返却
   * 
   * @param uuid 比較対象
   * @returns 自身のUUIDと、他のオブジェクトの表すUUIDが等しいか否か
   */
  equals(uuid: Uuid | string): boolean {
    if (typeof uuid === "string") {
      try {
        return this.#bytes.equals(Uuid.parse(uuid).#bytes);
      }
      catch (exception) {
        return false;
      }
    }
    return this.#bytes.equals(uuid.#bytes);
  }

  /**
   * @override
   * @returns The string representation of the value of this instance.
   */
  toString(): string {
    return this.format();
  }

  /**
   * @returns The string representation of the value of this instance.
   */
  toJSON(): string {
    return this.format();
  }

  /**
   * @returns The URN of the value of this instance.
   */
  toUuidUrl(): Uri {
    return new Uri("urn:uuid:" + this.format());
  }
}
Object.freeze(Uuid);

export { Uuid };
