
import { Exception } from "../_";
import { TextEncoding, TextEncodingImpl, TextEncodingOptions } from "./index";

class Utf8Encoding implements TextEncodingImpl {

  #decoder: TextDecoder;

  #encoder: TextEncoder;

  constructor(options: TextEncodingOptions = {}) {
    void options;
    // replacementFallback
    // exceptionFallback
    // prependBom,removeBom


    this.#decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    this.#encoder = new TextEncoder();
    Object.freeze(this);
  }

  decode(encoded: Uint8Array): string {
    try {
      return this.#decoder.decode(encoded);
    }
    catch (exception) {
      throw new Exception("EncodingError", "decode error", exception);
    }
  }

  encode(toEncode: string): Uint8Array {
    return this.#encoder.encode(toEncode);
  }
}
Object.freeze(Utf8Encoding);

TextEncoding.register("base64", Utf8Encoding);
