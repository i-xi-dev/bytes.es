// //

import {
  type DigestAlgorithm,
  Sha256,
  Sha384,
  Sha512,
  StringUtils,
} from "@i-xi-dev/fundamental";
import { MediaType } from "@i-xi-dev/mimetype";
import { ByteSequence } from "./byte_sequence";

const {
  ASCII_WHITESPACE,
  HTTP_TAB_OR_SPACE,
} = StringUtils.RangePattern;

/**
 * Headers#getで取得した値を分割する
 * （複数ヘッダーだった場合、","で連結されているので分割する）
 * 
 * かつてはHeaders#getAllすれば良かったが、それは廃止されたので。
 * {@link https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split} のsplitの部分の仕様で分割する
 * 
 * @param value Headers#getで取得した値
 * @returns 分割結果
 */
function splitWebHeaderValue(value: string): Array<string> {
  const notU0022OrU002C = "\\u0022\\u002C";
  const values: Array<string> = [];
  let work = value;
  while (work.length > 0) {
    let splitted = StringUtils.collect(work, notU0022OrU002C);
    work = work.substring(splitted.length);
    if (work.startsWith("\u0022")) {
      const result = StringUtils.collectHttpQuotedString(work);
      splitted = splitted + result.collected;
      work = work.substring(result.progression);
    }
    else { // work.startsWith("\u002C")
      work = work.substring(1);
    }
    values.push(StringUtils.trim(splitted, HTTP_TAB_OR_SPACE));
  }
  return values;
}

/**
 * RequestまたはResponseのヘッダーからContent-Typeの値を取得し返却する
 * 
 * {@link https://fetch.spec.whatwg.org/#content-type-header Fetch standard}の仕様に合わせた
 * 
 * @param headers ヘッダー
 * @returns Content-Typeの値から生成したMediaTypeインスタンス
 */
function extractContentType(headers: Headers): MediaType {
  // 5.
  if (headers.has("Content-Type") !== true) {
    throw new Error("Content-Type field not found");
  }

  // 4, 5.
  const typesString = headers.get("Content-Type") as string;
  const typeStrings = splitWebHeaderValue(typesString);
  if (typeStrings.length <= 0) {
    throw new Error("Content-Type value not found");
  }

  // 1, 2, 3.
  let textEncoding = "";
  let mediaTypeEssence = "";
  let mediaType: MediaType | null = null;
  // 6.
  for (const typeString of typeStrings) {
    try {
      // 6.1.
      const tempMediaType = MediaType.fromString(typeString);

      // 6.3.
      mediaType = tempMediaType;

      // 6.4.
      if (mediaTypeEssence !== mediaType.essence) {
        // 6.4.1.
        textEncoding = "";
        // 6.4.2.
        if (mediaType.hasParameter("charset")) {
          textEncoding = mediaType.getParameterValue("charset") as string;
        }
        // 6.4.3.
        mediaTypeEssence = mediaType.essence;
      }
      else {
        // 6.5.
        if ((mediaType.hasParameter("charset") !== true) && (textEncoding !== "")) {
          // TODO mediaType.withParameters()
        }
      }
    }
    catch (exception) {
      console.log(exception);// TODO 消す
      // 6.2. "*/*"はMediaType.fromStringでエラーにしている
      continue;
    }
  }

  // 7, 8.
  if (mediaType !== null) {
    return mediaType;
  }
  else {
    throw new Error("extraction failure");
  }
}

/**
 * RequestまたはResponseのヘッダーからContent-Lengthの値を取得し返却する
 * 
 * {@link https://fetch.spec.whatwg.org/#content-length-header Fetch standard}の仕様に合わせた
 * 
 * @param headers ヘッダー
 * @returns Content-Lengthの値から生成した数値、取得できなかった場合はnull
 */
function extractContentLength(headers: Headers): number | null {
  // 当ファイルの処理において、圧縮や分割されている場合はContent-Lengthの値は必要ない為nullを返す
  // ヘッダーフィールドの値がコンマ区切りリストの場合は内容にかかわらず圧縮か分割がされているとみなす
  if (headers.has("Content-Encoding")) {
    const contentEncoding = headers.get("Content-Encoding") as string;
    if (contentEncoding.toLowerCase() !== "identity") {
      return null;
    }
  }
  if (headers.has("Transfer-Encoding")) {
    const transferEncoding = headers.get("Transfer-Encoding") as string;
    if (transferEncoding.toLowerCase() !== "identity") {
      return null;
    }
  }
  // 以降はFetch standardの仕様通りに取得

  // 2.
  if (headers.has("Content-Length") !== true) {
    return null;
  }

  // 1, 2.
  const sizesString = headers.get("Content-Length") as string;
  const sizeStrings = splitWebHeaderValue(sizesString);
  if (sizeStrings.length <= 0) {
    return null;
  }

  // 3.
  let candidateValue: string | null = null;
  // 4.
  for (const sizeString of sizeStrings) {
    // 4.1.
    if (candidateValue === null) {
      candidateValue = sizeString;
    }
    else {
      // 4.2.
      throw new Error("Content-Length duplicated");
    }
  }
  candidateValue = candidateValue as string;

  // 5.
  if (/^[0-9]+$/.test(candidateValue) !== true) {
    return null;
  }
  // 6.
  return Number.parseInt(candidateValue, 10);
}

type HttpMessage = Request | Response;

type HttpMessageReadingOptions = {
  ignoreHttpStatus: boolean,
  readAs: "blob" | "stream",
};// TODO default options

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
  #data: ByteSequence;

  /**
   * @param mediaType メディアタイプ
   * @param bytes バイト列
   */
  protected constructor(mediaType: MediaType, bytes: ByteSequence) {
    this.#mediaType = mediaType;
    this.#data = bytes;
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
  get data(): ByteSequence {
    return this.#data;
  }

  /**
   * サイズ（バイト列のバイト数）
   */
  get size(): number {
    return this.#data.count;
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
      const bytes = ByteSequence.wrap(buffer);

      return new Resource(mediaType, bytes);
    }
    catch (exception) {
      // NotFoundError | SecurityError | NotReadableError
      // TODO throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  /**
   * 自身のメディアタイプとバイト列からBlobを生成し返却
   * 
   * @returns Blob
   */
  toBlob(): Blob {
    return new Blob([ this.#data.buffer ], {
      type: this.#mediaType.toString(),
    });
  }

  /**
   * Data URLからインスタンスを生成し返却
   * 
   * {@link [Fetch Standard](https://fetch.spec.whatwg.org/#data-urls)}の仕様に従った。
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
      throw new TypeError("U+002C not found");
    }

    const mediaTypeOriginal = bodyStringWork.split(",")[0] as string;
    let mediaTypeWork = StringUtils.trim(mediaTypeOriginal, ASCII_WHITESPACE);

    // 8, 9
    bodyStringWork = bodyStringWork.substring(mediaTypeOriginal.length + 1);

    // 10
    let bodyWork = ByteSequence.fromPercentEncoded(bodyStringWork);

    // 11
    const base64Indicator = /;[\u0020]*base64$/i;
    const base64: boolean = base64Indicator.test(mediaTypeWork);
    if (base64 === true) {
      // 11.1
      bodyStringWork = bodyWork.toBinaryString();

      // 11.2, 11.3
      bodyWork = ByteSequence.fromBase64Encoded(bodyStringWork);

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
  toDataURL(): URL {
    const encoding = ";base64";
    const dataEncoded = this.#data.toBase64Encoded();

    return new URL("data:" + this.#mediaType.toString() + encoding + "," + dataEncoded);
  }

  async toSha256Integrity(): Promise<string> {
    return this.#toIntegrity(Sha256, "sha256-");
  }

  async toSha384Integrity(): Promise<string> {
    return this.#toIntegrity(Sha384, "sha384-");
  }

  async toSha512Integrity(): Promise<string> {
    return this.#toIntegrity(Sha512, "sha512-");
  }

  /**
   * Computes the SRI integrity (base64-encoded digest).
   * 
   * @see {@link [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)}
   * @param algorithm The digest algorithm.
   * @returns The {@link [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)} that
   *     fulfills with a SRI integrity (base64-encoded digest).
   */
  async #toIntegrity(algorithm: DigestAlgorithm, prefix: string): Promise<string> {
    // algorithmは2021-12時点でSHA-256,SHA-384,SHA-512のどれか
    const digestBytes = await this.#data.toDigest(algorithm);
    return prefix + digestBytes.toBase64Encoded();
  }

  /**
   * @experimental
   * TODO signal,timeout
   */
  static async fromHttpMessage(message: HttpMessage, options: HttpMessageReadingOptions): Promise<Resource | null> {
    if (message.body) {
      if (message instanceof Response) {
        if ((message.ok !== true) && (options.ignoreHttpStatus !== true)) {
          throw new Error(`HTTP status: ${ message.status }`);
        }
      }

      if (options.readAs === "blob") {
        const blob = await message.blob();
        return Resource.fromBlob(blob);
      }

      const mediaType = extractContentType(message.headers);
      if (message.body !== null) {
        // メモ
        // ・Transfer-Encodingがchunkedであってもfetch API側でまとめてくれるので、考慮不要
        // ・Content-Encodingで圧縮されていてもfetch API側で展開してくれるので、展開は考慮不要
        //    ただしその場合、Content-Lengthは展開結果のバイト数ではない

        const size = extractContentLength(message.headers);
        const bytes = await ByteSequence.fromStream(message.body, size ? size : undefined);
        return new Resource(mediaType, bytes);
      }
    }
    return null;
  }
}
Object.freeze(Resource);

export { Resource };
