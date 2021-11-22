//

import { Exception } from "../_";
import { TextEncodingImplementation } from "./_";
import { Utf8 } from "./utf_8";
import { UsAscii } from "./us_ascii";

const registry = new Map<string, TextEncodingImplementation>();

function register(name: string, implementation: TextEncodingImplementation): void {
  registry.set(name.toLowerCase(), implementation);
}

register(Utf8.name, Utf8);
register(UsAscii.name, UsAscii);

function getImplementation(name: string): TextEncodingImplementation {
  const normalizedName = name.toLowerCase();
  if (registry.has(normalizedName)) {
    return registry.get(normalizedName) as TextEncodingImplementation;
  }
  throw new Exception("NotFoundError", "name:" + name);
}

export { TextEncodingImplementation };
export { TextDecodeOptions, TextEncodeOptions } from "./_.js";

export const TextEncoding = Object.freeze({
  register,
  for: getImplementation,
});
