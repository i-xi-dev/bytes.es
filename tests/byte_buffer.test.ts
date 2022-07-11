import { assertNotStrictEquals, assertStrictEquals } from "std/testing/asserts";
import { ByteBuffer } from "../src/byte_buffer.ts";

Deno.test("new ByteBuffer()/capacity/position/put()", () => {
  const b = new ByteBuffer();

  assertStrictEquals(b.capacity, 1_048_576);
  assertStrictEquals(b.position, 0);

  b.put(Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));
  assertStrictEquals(b.capacity, 1_048_576);
  assertStrictEquals(b.position, 12);

  b.put(Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));
  assertStrictEquals(b.capacity, 1_048_576);
  assertStrictEquals(b.position, 24);
});

Deno.test("new ByteBuffer(number)/capacity/position/put()", () => {
  const b = new ByteBuffer(10);

  assertStrictEquals(b.capacity, 10);
  assertStrictEquals(b.position, 0);

  b.put(Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));
  assertStrictEquals(b.capacity, 10485760);
  assertStrictEquals(b.position, 12);

  b.put(Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));
  assertStrictEquals(b.capacity, 10485760);
  assertStrictEquals(b.position, 24);

  const copy1 = b.subarray();
  assertStrictEquals(copy1.buffer, b.subarray().buffer);
  assertStrictEquals(copy1.byteLength, 24);
  assertStrictEquals(copy1.buffer.byteLength, 10485760);
  assertStrictEquals(
    [...copy1].map((b) => b.toString(10)).join(","),
    "1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12",
  );

  const copy2 = b.slice();
  assertNotStrictEquals(copy2.buffer, copy1.buffer);
  assertStrictEquals(copy2.byteLength, 24);
  assertStrictEquals(copy2.buffer.byteLength, 24);
  assertStrictEquals(
    [...copy2].map((b) => b.toString(10)).join(","),
    "1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12",
  );
});
