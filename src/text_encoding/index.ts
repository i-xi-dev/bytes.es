//

import { TextEncodingImplementation } from "./_.js";
import { Utf8 } from "./utf_8.js";
import { ShiftJis } from "./shift_jis.js";
import { UsAscii } from "./us_ascii.js";

const registry = new Map<string, TextEncodingImplementation>();

registry.set(Utf8.name.toLowerCase(), Utf8);
registry.set(ShiftJis.name.toLowerCase(), ShiftJis);
registry.set(UsAscii.name.toLowerCase(), UsAscii);

function getImpl(name: string): TextEncodingImplementation | undefined {
  return registry.get(name.toLowerCase());
}

export { TextDecodeOptions, TextEncodeOptions } from "./_.js";

export const TextEncoding = {
  for: getImpl,
};
