//

import { Exception } from "./_.js";
import { ByteSequence } from "./byte_sequence.js";

/**
 * 特別スキーム
 */
const SpecialScheme = {
  FILE: "file",
  FTP: "ftp",
  HTTP: "http",
  HTTPS: "https",
  WS: "ws",
  WSS: "wss",
} as const;

// const DefaultPortMap: Map<string, number> = new Map([
//   [ SpecialScheme.FILE, Number.NaN ],
//   [ SpecialScheme.FTP, 21 ],
//   [ SpecialScheme.HTTP, 80 ],
//   [ SpecialScheme.HTTPS, 443 ],
//   [ SpecialScheme.WS, 80 ],
//   [ SpecialScheme.WSS, 443 ],
// ]);

/**
 * URI文字列が絶対URIを表しているか否かを返却
 * 
 * @param uriString URI文字列
 * @param scheme スキーム
 * @returns URI文字列が絶対URIを表しているか否か
 */
function isAbsolute(uriString: string, scheme: string): boolean {
  let separator = ":";
  if ((Object.values(SpecialScheme) as Array<string>).includes(scheme)) {
    separator = "://";
  }
  return uriString.toLowerCase().startsWith(scheme + separator);
}

/**
 * 絶対URI
 *     不変オブジェクト
 */
class Uri {
  /**
   * 内部表現
   */
  #uri: URL;

  /**
   * @param uri 絶対URIを表す文字列またはURLオブジェクト
   */
  constructor(uri: URL | string) {
    let uriString: string;
    if (uri instanceof URL) {
      uriString = uri.toString();
    }
    else {
      uriString = uri;
    }

    try {
      // この時点ではuriStringが相対URIか判別できないので、一旦内部表現を生成
      // （ブラウザーならhttp、Node.jsならfile、などのスキームで絶対URIが生成される）
      this.#uri = new URL(uriString);
    }
    catch (exception) {
      throw new URIError("uri");
    }

    // 生成された内部表現のスキームで、uriStringが絶対URIか否か判定
    if (isAbsolute(uriString, this.scheme) !== true) {
      throw new Exception("DataError", "uri must be absolute");
    }

    Object.freeze(this);
  }

  /**
   * オリジン
   */
  get origin(): string | null {
    return this.#uri.origin === "null" ? null : this.#uri.origin;
  }

  /**
   * スキーム
   */
  get scheme(): string {
    return this.#uri.protocol.replace(/:$/, "");
  }

  // XXX get host(): string

  // XXX get port(): number

  // XXX get path(): PathSegmentList

  // XXX get query(): Array<[ string, string ]>

  /**
   * 素片
   */
  get fragment(): string | null {
    if (this.#uri.hash.length <= 0) {
      const work = new URL(this.#uri.toString());
      if (work.toString().endsWith("#")) {
        return "";
      }
      return null;
    }

    const fragment = this.#uri.hash.replace(/^#/, "");
    const bytes = ByteSequence.fromPercent(fragment);
    return bytes.asText("UTF-8");
  }

  /**
   * URLを表す文字列を生成し返却
   * 
   * @override
   * @returns URLを表す文字列
   */
  toString(): string {
    return this.#uri.toString();
  }

  /**
   * URLを表す文字列を生成し返却
   * 
   * @returns URLを表す文字列
   */
  toJSON(): string {
    return this.toString();
  }

  // XXX resolveRelativeUri(relativeUriString: string): Uri {

  // XXX withQuery(query: Array<[ string, string ]>): Uri {

  // XXX withoutQuery(): Uri

  /**
   * 自身のURIと指定した素片で新たなインスタンスを生成し返却
   * 
   * ※空文字列をセットした場合の挙動はURL.hashに合わせた
   *   （toStringした結果は末尾"#"となる。末尾"#"を取り除きたい場合はwithoutFragmentすべし）
   * 
   * @param fragment 素片 ※先頭に"#"は不要
   * @returns 生成したインスタンス
   */
  withFragment(fragment: string): Uri {
    const work = new URL(this.#uri.toString());
    work.hash = "#" + fragment; // 0x20,0x22,0x3C,0x3E,0x60 の%エンコードは自動でやってくれる
    return new Uri(work.toString());
  }

  /**
   * 自身のURIから素片を除いた新たなインスタンスを生成し返却
   * 
   * @returns 生成したインスタンス
   */
  withoutFragment(): Uri {
    const work = new URL(this.#uri.toString());
    work.hash = "";
    return new Uri(work.toString());
  }
}
Object.freeze(Uri);

export { Uri };

// TODO
// const PercentEncodeSet = {
//   //UriFragment: [ 0x20, 0x22, 0x3C, 0x3E, 0x60 ] as const,
//   UriQuery: [ 0x20, 0x22, 0x23, 0x3C, 0x3E ] as const,
//   UriSpecialQuery: [ 0x20, 0x22, 0x23, 0x27, 0x3C, 0x3E ] as const,
//   UriPath: [ 0x20, 0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60, 0x7B, 0x7D ] as const,
//   UriUserInfo: [ 0x20, 0x22, 0x23, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ] as const,
//   UriComponent: [ 0x20, 0x22, 0x23, 0x24, 0x25, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ] as const,
// } as const;
// // 外に出す
// //   AppXWwwFormUrlEncoded: "",// UriComponent + 0x21,0x27,0x28,0x29,0x7E
