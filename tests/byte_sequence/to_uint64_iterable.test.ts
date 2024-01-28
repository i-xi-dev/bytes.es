import { assertStrictEquals, assertThrows } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.prototype.toBigUint64Iterable()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals([...bs0.toBigUint64Iterable()].length, 0);
  assertStrictEquals([...bs1.toBigUint64Iterable()].length, 125);

  const a2 = [1, 2, 3, 4, 5, 6, 0, 255];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(
    [72623859790381311n].join(""),
    [...bs2.toBigUint64Iterable(ByteOrder.BIG_ENDIAN)].join(""),
  );

  const a2l = [1, 2, 3, 4, 5, 6, 0, 255];
  const bs2l = ByteSequence.fromArray(a2l);
  assertStrictEquals(
    [18374693098283532801n].join(""),
    [...bs2l.toBigUint64Iterable(ByteOrder.LITTLE_ENDIAN)].join(""),
  );

  assertThrows(
    () => {
      const a1 = [1, 2, 3, 4, 5, 6, 0];
      const bs1 = ByteSequence.fromArray(a1);
      bs1.toBigUint64Iterable();
    },
    RangeError,
    "bytes",
  );
  assertThrows(
    () => {
      const a1 = [1, 2, 3, 4, 5, 6, 0, 0, 0];
      const bs1 = ByteSequence.fromArray(a1);
      bs1.toBigUint64Iterable();
    },
    RangeError,
    "bytes",
  );
});
