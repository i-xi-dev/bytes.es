// // // //

// import {
//   HttpUtils,
// } from "@i-xi-dev/fundamental";
// import { MediaType } from "@i-xi-dev/mimetype";

// // XXX Headers#getで取得した値をgetAllでかつて取得できた値と同等に戻すのは不可能なので、
// //     使用しない
// /**
//  * RequestまたはResponseのヘッダーからContent-Typeの値を取得し返却する
//  * 
//  * {@link https://fetch.spec.whatwg.org/#content-type-header Fetch standard}の仕様に合わせた
//  * 
//  * @param headers ヘッダー
//  * @returns Content-Typeの値から生成したMediaTypeインスタンス
//  */
// export function _extractContentType(headers: Headers): MediaType {
//   // 5.
//   if (headers.has("Content-Type") !== true) {
//     throw new Error("Content-Type field not found");
//   }

//   // 4, 5.
//   const typesString = headers.get("Content-Type") as string;
//   const typeStrings = HttpUtils.splitHeaderValue(typesString);
//   if (typeStrings.length <= 0) {
//     throw new Error("Content-Type value not found");
//   }

//   // 1, 2, 3.
//   let textEncoding = "";
//   let mediaTypeEssence = "";
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
//           // TODO mediaType.withParameters()
//         }
//       }
//     }
//     catch (exception) {
//       console.log(exception);// TODO 消す
//       // 6.2. "*/*"はMediaType.fromStringでエラーにしている
//       continue;
//     }
//   }

//   // 7, 8.
//   if (mediaType !== null) {
//     return mediaType;
//   }
//   else {
//     throw new Error("extraction failure");
//   }
// }

// /**
//  * RequestまたはResponseのヘッダーからContent-Lengthの値を取得し返却する
//  * 
//  * {@link https://fetch.spec.whatwg.org/#content-length-header Fetch standard}の仕様に合わせた
//  * 
//  * @param headers ヘッダー
//  * @returns Content-Lengthの値から生成した数値、取得できなかった場合はnull
//  * //TODO throws
//  */
// export function _extractContentLength(headers: Headers): number | null {
//   // 当ファイルの処理において、圧縮や分割されている場合はContent-Lengthの値は必要ない為nullを返す
//   // ヘッダーフィールドの値がコンマ区切りリストの場合は内容にかかわらず圧縮か分割がされているとみなす
//   if (headers.has("Content-Encoding")) {
//     const contentEncoding = headers.get("Content-Encoding") as string;
//     if (contentEncoding.toLowerCase() !== "identity") {
//       return null;
//     }
//   }
//   if (headers.has("Transfer-Encoding")) {
//     const transferEncoding = headers.get("Transfer-Encoding") as string;
//     if (transferEncoding.toLowerCase() !== "identity") {
//       return null;
//     }
//   }
//   // 以降はFetch standardの仕様通りに取得

//   // 2.
//   if (headers.has("Content-Length") !== true) {
//     return null;
//   }

//   // 1, 2.
//   const sizesString = headers.get("Content-Length") as string;
//   const sizeStrings = HttpUtils.splitHeaderValue(sizesString);
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
//       throw new Error("Content-Length duplicated");
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