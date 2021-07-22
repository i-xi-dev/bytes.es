
import { TextEncodingImpl } from "./_";
import { Utf8 } from "./utf_8";
import { ShiftJis } from "./shift_jis";

const registry = new Map<string, TextEncodingImpl>();

function getImpl(name: string): TextEncodingImpl | undefined {
  return registry.get(name);
}

export { TextDecodeOptions, TextEncodeOptions } from "./_";

export const TextEncoding = {
  for: getImpl,
};

registry.set(Utf8.name, Utf8);
registry.set(ShiftJis.name, ShiftJis);
