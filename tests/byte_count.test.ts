import {
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts";
import { ByteCount, ByteUnit } from "../mod.ts";

Deno.test("new ByteCount(number)", () => {
  const bc0 = new ByteCount(0);
  assertStrictEquals(bc0.valueOf(), 0);

  const bcm = new ByteCount(Number.MAX_SAFE_INTEGER);
  assertStrictEquals(bcm.valueOf(), Number.MAX_SAFE_INTEGER);

  assertThrows(
    () => {
      new ByteCount(1.1);
    },
    RangeError,
    "byteCount",
  );
  assertThrows(
    () => {
      new ByteCount(-1);
    },
    RangeError,
    "byteCount",
  );
});

Deno.test("new ByteCount(bigint)", () => {
  const bc0 = new ByteCount(0n);
  assertStrictEquals(bc0.valueOf(), 0);

  assertThrows(
    () => {
      new ByteCount(BigInt(Number.MAX_SAFE_INTEGER) + 1n);
    },
    RangeError,
    "byteCount",
  );
  assertThrows(
    () => {
      new ByteCount(-1n);
    },
    RangeError,
    "byteCount",
  );
});

Deno.test("new ByteCount(any)", () => {
  assertThrows(
    () => {
      new ByteCount(undefined as unknown as number);
    },
    TypeError,
    "byteCount",
  );
  assertThrows(
    () => {
      new ByteCount("1" as unknown as number);
    },
    TypeError,
    "byteCount",
  );
});

Deno.test("ByteCount.prototype.to(string)", () => {
  const bc0 = new ByteCount(0);
  assertStrictEquals(bc0.to(ByteUnit.B), 0);
  assertStrictEquals(bc0.to(ByteUnit.KIB), 0);
  assertStrictEquals(bc0.to(ByteUnit.KB), 0);

  const bc1 = new ByteCount(1000);
  assertStrictEquals(bc1.to(ByteUnit.B), 1000);
  assertStrictEquals(bc1.to(ByteUnit.KB), 1);

  const bc1i = new ByteCount(1024);
  assertStrictEquals(bc1i.to(ByteUnit.B), 1024);
  assertStrictEquals(bc1i.to(ByteUnit.KIB), 1);

  const bce1 = new ByteCount(1);
  assertThrows(
    () => {
      bce1.to("" as unknown as ByteUnit);
    },
    RangeError,
    "unit",
  );
  assertThrows(
    () => {
      bce1.to("b" as unknown as ByteUnit);
    },
    RangeError,
    "unit",
  );

});

Deno.test("ByteCount.prototype.to(any)", () => {
  const bce1 = new ByteCount(1);
  assertThrows(
    () => {
      bce1.to(undefined as unknown as ByteUnit);
    },
    TypeError,
    "unit",
  );
});

Deno.test("ByteCount.prototype.valueOf()", () => {
  const bc0 = new ByteCount(0);
  assertStrictEquals(bc0.valueOf(), 0);

  const bc1 = new ByteCount(1000);
  assertStrictEquals(bc1.valueOf(), 1000);

  const bc1i = new ByteCount(1024);
  assertStrictEquals(bc1i.valueOf(), 1024);

});


