
import { TextEncodingImpl } from "./_";
import { Utf8 } from "./utf_8";
import { ShiftJis } from "./shift_jis";

const registry = new Map<string, TextEncodingImpl>();

registry.set(Utf8.name.toLowerCase(), Utf8);
registry.set(ShiftJis.name.toLowerCase(), ShiftJis);

function getImpl(name: string): TextEncodingImpl | undefined {
  return registry.get(name.toLowerCase());
}

export { TextDecodeOptions, TextEncodeOptions } from "./_";

export const TextEncoding = {
  for: getImpl,
};
