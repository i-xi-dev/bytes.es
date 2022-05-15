//

const DEFAULT_SIZE = 1_048_576;

class ByteBuffer {
  #position: number;
  #buffer: Uint8Array;

  constructor(size: number = DEFAULT_SIZE) {
    this.#position = 0;
    this.#buffer = new Uint8Array(size);
    Object.seal(this);
  }

  get capacity(): number {
    return this.#buffer.byteLength;
  }

  get position(): number {
    return this.#position;
  }

  // XXX 最後に連結すべき？
  // XXX おそらくそのうちArrayBufferの長さ可変がES仕様になる
  put(bytes: Uint8Array): void {
    if ((this.#position + bytes.byteLength) > this.#buffer.byteLength) {
      const extent = Math.max(bytes.byteLength, DEFAULT_SIZE);
      const extendedBuffer = new Uint8Array(this.#position + (extent * 10)); // XXX どのくらいが適正？
      extendedBuffer.set(this.#buffer, 0);
      this.#buffer = extendedBuffer;
    }
    this.#buffer.set(bytes, this.#position);
    this.#position = this.#position + bytes.byteLength;
  }

  subarray(begin = 0, end: number = this.#position): Uint8Array {
    return this.#buffer.subarray(begin, end);
  }

  slice(begin = 0, end: number = this.#position): Uint8Array {
    return this.#buffer.slice(begin, end);
  }
}
Object.freeze(ByteBuffer);

export { ByteBuffer };
