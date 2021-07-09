
import { ByteFormat } from "./format";
import { ByteEncoding } from "./encoding";

//ByteEncoding.register("base64", (await import("./encoding/base64")).Base64Encoding); //XXX Jestで実行時エラーになる
//ByteEncoding.register("percent", (await import("./encoding/percent")).PercentEncoding);
import { Base64Encoding } from "./encoding/base64";
ByteEncoding.register("base64", Base64Encoding);
import { PercentEncoding } from "./encoding/percent";
ByteEncoding.register("percent", PercentEncoding);

const Byte = Object.freeze({
  Format: ByteFormat,
  Encoding: ByteEncoding,
});

export { Byte };
