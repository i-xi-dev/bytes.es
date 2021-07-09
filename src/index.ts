
import { ByteFormat } from "./format";
import { ByteEncoding } from "./encoding/index";
import { DigestAlgorithm } from "./digest_algorithm/index";

// ByteEncoding.register("base64", (await import("./encoding/base64")).Base64Encoding); //XXX Jestで実行時エラーになる
// ByteEncoding.register("percent", (await import("./encoding/percent")).PercentEncoding);
import { Base64Encoding } from "./encoding/base64";
ByteEncoding.register("base64", Base64Encoding);
import { PercentEncoding } from "./encoding/percent";
ByteEncoding.register("percent", PercentEncoding);

import { Sha256Algorithm } from "./digest_algorithm/sha_256";
DigestAlgorithm.register("sha-256", Sha256Algorithm);

const Byte = Object.freeze({
  Format: ByteFormat,
  Encoding: ByteEncoding,
  DigestAlgorithm,
});

export { Byte };
