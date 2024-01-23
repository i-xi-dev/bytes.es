export * from "https://deno.land/std@0.211.0/assert/mod.ts";
export * from "https://deno.land/std@0.160.0/hash/md5.ts";
export { BytesUnit } from "https://raw.githubusercontent.com/i-xi-dev/bytes-size.es/1.0.15/mod.ts";

import { BufferUtils } from "../deps.ts";
export const Platform = {
  BYTE_ORDER: BufferUtils.BYTE_ORDER,
  isBigEndian: BufferUtils.isBigEndian,
  isLittleEndian: BufferUtils.isLittleEndian,
};
