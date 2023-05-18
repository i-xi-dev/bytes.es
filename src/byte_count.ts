import { Integer } from "../deps.ts";
import { ByteUnit } from "./byte_unit.ts";

type int = number;

const _BYTES: Record<ByteUnit, int> = {
  [ByteUnit.B]: 1,
  [ByteUnit.KB]: 1_000, // 10 ** 3
  [ByteUnit.MB]: 1_000_000, // 10 ** 6
  [ByteUnit.GB]: 1_000_000_000, // 10 ** 9
  [ByteUnit.TB]: 1_000_000_000_000, // 10 ** 12
  [ByteUnit.PB]: 1_000_000_000_000_000, // 10 ** 15
  [ByteUnit.KIB]: 1_024, // 2 ** 10
  [ByteUnit.MIB]: 1_048_576, // 2 ** 20
  [ByteUnit.GIB]: 1_073_741_824, // 2 ** 30
  [ByteUnit.TIB]: 1_099_511_627_776, // 2 ** 40
  [ByteUnit.PIB]: 1_125_899_906_842_624, // 2 ** 50
} as const;

class ByteCount {
  #byteCount: int;

  constructor(byteCount: int | bigint) {
    if (typeof byteCount === "bigint") {
      if ((byteCount >= 0) && (byteCount <= Number.MAX_SAFE_INTEGER)) {
        this.#byteCount = Number(byteCount);
      } else {
        throw new RangeError("byteCount");
      }
    } else if (typeof byteCount === "number") {
      if (Integer.isNonNegativeInteger(byteCount) === true) {
        this.#byteCount = byteCount;
      } else {
        throw new RangeError("byteCount");
      }
    } else {
      throw new TypeError("byteCount");
    }

    Object.freeze(this);
  }

  // static of(value: number, unit: string = ByteUnit.B): ByteCount {
  //   return new ByteCount(Math.ceil(value * _BYTES[unit]));
  // }

  /**
   * @param unit The following units are supported. Units are case sensitive.
   * - `"byte"`
   * - `"kilobyte"`
   * - `"kibibyte"`
   * - `"megabyte"`
   * - `"mebibyte"`
   * - `"gigabyte"`
   * - `"gibibyte"`
   * - `"terabyte"`
   * - `"tebibyte"`
   * - `"petabyte"`
   * - `"pebibyte"`
   * @returns The byte count expressed in specified unit.
   */
  to(unit: ByteUnit): number {
    if (typeof unit === "string") {
      if (Object.values(ByteUnit).includes(unit) !== true) {
        throw new RangeError("unit");
      }
    } else {
      throw new TypeError("unit");
    }

    const lowerUnit = unit.toLowerCase();
    const found = Object.values(ByteUnit).find((u) =>
      u.toLowerCase() === lowerUnit
    );
    if (found) {
      return this.#byteCount / _BYTES[found];
    }
    return undefined as never;
  }

  valueOf(): number {
    return this.#byteCount;
  }
}
Object.freeze(ByteCount);

export { ByteCount };
