import { assertStrictEquals } from "../deps.ts";
import { ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.prototype.toUint8Iterable()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals([...bs0.toUint8Iterable()].length, 0);
  assertStrictEquals([...bs1.toUint8Iterable()].length, 1000);

  const a2 = [1, 2, 3, 4, 0, 255];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(
    JSON.stringify(a2),
    JSON.stringify([...bs2.toUint8Iterable()]),
  );
});
