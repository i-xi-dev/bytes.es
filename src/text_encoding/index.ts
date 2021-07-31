//

import { TextEncodingImplementation } from "./_";
import { Utf8 } from "./utf_8";
import { ShiftJis } from "./shift_jis";
import { UsAscii } from "./us_ascii";

const registry = new Map<string, TextEncodingImplementation>();

registry.set(Utf8.name.toLowerCase(), Utf8);
registry.set(ShiftJis.name.toLowerCase(), ShiftJis);
registry.set(UsAscii.name.toLowerCase(), UsAscii);

function getImpl(name: string): TextEncodingImplementation | undefined {
  return registry.get(name.toLowerCase());
}

export { TextDecodeOptions, TextEncodeOptions } from "./_";

export const TextEncoding = {
  for: getImpl,
};
