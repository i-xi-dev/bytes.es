import { assertStrictEquals } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.prototype.toUint32Iterable()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals([...bs0.toUint32Iterable()].length, 0);
  assertStrictEquals([...bs1.toUint32Iterable()].length, 250);

  const a2 = [1, 2, 3, 4, 5, 6, 0, 255];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(
    JSON.stringify([16_909_060, 84_279_551]),
    JSON.stringify([...bs2.toUint32Iterable(ByteOrder.BIG_ENDIAN)]),
  );

  const a3 = [1, 2, 3, 4, 5, 6, 0, 0xFFFF];
  const bs3 = ByteSequence.fromUint16Iterable(a3, ByteOrder.BIG_ENDIAN);
  assertStrictEquals(
    JSON.stringify([65_538, 196_612, 327_686, 65_535]),
    JSON.stringify([...bs3.toUint32Iterable(ByteOrder.BIG_ENDIAN)]),
  );

  const a4 = [1, 2, 3, 4, 5, 6, 0, 0xFFFF];
  const bs4 = ByteSequence.fromUint32Iterable(a4, ByteOrder.BIG_ENDIAN);
  assertStrictEquals(
    JSON.stringify([...a4]),
    JSON.stringify([...bs4.toUint32Iterable(ByteOrder.BIG_ENDIAN)]),
  );
});
