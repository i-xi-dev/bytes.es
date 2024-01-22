import { assertStrictEquals } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.prototype.toUint16Iterable()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals([...bs0.toUint16Iterable()].length, 0);
  assertStrictEquals([...bs1.toUint16Iterable()].length, 500);

  const a2 = [1, 2, 3, 4, 0, 255];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(
    JSON.stringify([258, 772, 255]),
    JSON.stringify([...bs2.toUint16Iterable(ByteOrder.BIG_ENDIAN)]),
  );

  const a3 = [1, 2, 3, 4, 0, 0xFFFF];
  const bs3 = ByteSequence.fromUint16Iterable(a3, ByteOrder.BIG_ENDIAN);
  assertStrictEquals(
    JSON.stringify([...a3]),
    JSON.stringify([...bs3.toUint16Iterable(ByteOrder.BIG_ENDIAN)]),
  );
});
