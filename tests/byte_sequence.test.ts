import {
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows,
  BytesUnit,
  Md5,
} from "./deps.ts";
import encja from "https://cdn.skypack.dev/encoding-japanese@2.0.0?dts";
import { ByteSequence } from "../mod.ts";

//const testFilesDir = Deno.cwd() + "/tests/_data/";
const testFilesDir = "C:/_dev/i-xi-dev/-bytes.es/tests/_data/";

Deno.test("ByteSequence.prototype.byteLength", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals(bs0.byteLength, 0);
  assertStrictEquals(bs1.byteLength, 1000);
});

Deno.test("ByteSequence.prototype.size", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);
  const bs1b = ByteSequence.allocate(1024);

  assertStrictEquals(bs0.size.valueOf(), 0);
  assertStrictEquals(bs0.size.to(BytesUnit.KB), 0);
  assertStrictEquals(bs1.size.valueOf(), 1000);
  assertStrictEquals(bs1.size.to(BytesUnit.KB), 1);
  assertStrictEquals(bs1.size.to(BytesUnit.B), 1000);
  assertStrictEquals(bs1b.size.valueOf(), 1024);
  assertStrictEquals(bs1b.size.to(BytesUnit.KIB), 1);
  assertStrictEquals(bs1b.size.to(BytesUnit.B), 1024);
});

Deno.test("ByteSequence.prototype.buffer", () => {
  const a0 = new ArrayBuffer(0);
  const bs0 = ByteSequence.wrapArrayBuffer(a0);
  const bs0b = ByteSequence.wrapArrayBuffer(a0);
  const a1 = new ArrayBuffer(100);
  const bs1 = ByteSequence.fromArrayBuffer(a1);
  const bs1b = ByteSequence.fromArrayBuffer(a1);

  assertStrictEquals(bs0.buffer, a0);
  assertStrictEquals(bs0.buffer, bs0b.buffer);
  assertNotStrictEquals(bs1.buffer, a1);
  assertNotStrictEquals(bs1.buffer, bs1b.buffer);
});

Deno.test("ByteSequence.prototype.buffer - 2", () => {
  // 返却値への操作は自身に影響する
  const bs1 = ByteSequence.wrapArrayBuffer(new ArrayBuffer(100));

  const x = new Uint8Array(bs1.buffer);
  assertStrictEquals(x[0], 0);

  x[0] = 255;
  assertStrictEquals(x[0], 255);
  assertStrictEquals(new Uint8Array(bs1.buffer)[0], 255);
});

Deno.test("ByteSequence.prototype.sha256Integrity", async () => {
  const b1 = new Blob([`*{color:red}`], { type: "text/css" });

  const b11 = await ByteSequence.fromBlob(b1);
  const i11a = await b11.sha256Integrity;
  assertStrictEquals(
    i11a,
    "sha256-IIm8EKKH9DeP2uG3Kn/lD4bbs5lgbsIi/L8hAswrj/w=",
  );
});

Deno.test("ByteSequence.prototype.sha384Integrity", async () => {
  const b1 = new Blob([`*{color:red}`], { type: "text/css" });

  const b11 = await ByteSequence.fromBlob(b1);
  const i11b = await b11.sha384Integrity;
  assertStrictEquals(
    i11b,
    "sha384-0uhOVMndkWKKHtfDkQSsXCcT4r7Xr5Q2bcQ/uczTl2WivQ5094ZFIZZut1y32IsF",
  );
});

Deno.test("ByteSequence.prototype.sha512Integrity", async () => {
  const b1 = new Blob([`*{color:red}`], { type: "text/css" });

  const b11 = await ByteSequence.fromBlob(b1);
  const i11c = await b11.sha512Integrity;
  assertStrictEquals(
    i11c,
    "sha512-lphfU9I644pv1b+t8yZp7b+kg+lFD+WcIeTqhWieCTRZJ4wWOxTAJxSk9rWrOmVb+TFJ2HfaKIBRFqQ0OOxyAw==",
  );
});

Deno.test("ByteSequence.allocate(number)", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1024 * 1024 * 1);

  assertStrictEquals(bs0.buffer.byteLength, 0);
  assertStrictEquals(bs1.buffer.byteLength, 1024 * 1024 * 1);

  const bs2 = ByteSequence.allocate(2);
  const bs2v = new Uint8Array(bs2.buffer);
  bs2v[0] = 255;
  assertStrictEquals(bs2.toUint8Array()[0], 255);

  assertThrows(
    () => {
      ByteSequence.allocate(-1);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      ByteSequence.allocate(1.5);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      ByteSequence.allocate(Number.NaN);
    },
    TypeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.wrapArrayBuffer(ArrayBuffer)", () => {
  const bytes0 = new Uint8Array(0);
  const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

  const bs0 = ByteSequence.wrapArrayBuffer(bytes0.buffer);
  const bs1 = ByteSequence.wrapArrayBuffer(bytes1.buffer);

  //assertStrictEquals(bs0 instanceof ByteSequence.$, true); TODO
  assertStrictEquals(bs0.byteLength, 0);
  assertStrictEquals(bs1.byteLength, 5);
});

Deno.test("ByteSequence.wrapArrayBuffer(*)", () => {
  assertThrows(
    () => {
      ByteSequence.wrapArrayBuffer(Uint8Array.of(255, 254, 1, 0, 100));
    },
    TypeError,
    "buffer",
  );

  assertThrows(
    () => {
      ByteSequence.wrapArrayBuffer([] as unknown as Uint8Array);
    },
    TypeError,
    "buffer",
  );
});

Deno.test("ByteSequence.wrapArrayBuffer - x", () => {
  // コンストラクターに渡したArrayBufferへの操作は、自身に影響する
  const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

  const bs1 = ByteSequence.wrapArrayBuffer(bytes1.buffer);
  const a1 = bytes1.buffer;
  const nb1 = new Uint8Array(a1);
  nb1.set([1, 2, 3, 4]);

  const bs1v = bs1.asUint8Array();
  assertStrictEquals(bs1v[0], 1);
  assertStrictEquals(bs1v[1], 2);
  assertStrictEquals(bs1v[2], 3);
  assertStrictEquals(bs1v[3], 4);
  assertStrictEquals(bs1v[4], 100);
});

Deno.test("ByteSequence.fromArrayBuffer(ArrayBuffer)", () => {
  const a0 = Uint8Array.of(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
  const bs0 = ByteSequence.fromArrayBuffer(a0.buffer);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.asUint8Array();
  assertStrictEquals(bs0a[0], 9);
  assertStrictEquals(bs0a[9], 0);

  const a1 = new ArrayBuffer(0);
  const bs1 = ByteSequence.fromArrayBuffer(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromArrayBuffer(*)", () => {
  const a0 = Uint8Array.of(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
  assertThrows(
    () => {
      ByteSequence.fromArrayBuffer(a0);
    },
    TypeError,
    "buffer",
  );
});

Deno.test("ByteSequence.prototype.toArrayBuffer()", () => {
  const a0 = new ArrayBuffer(0);
  const bs0 = ByteSequence.wrapArrayBuffer(a0);
  const bs0b = ByteSequence.wrapArrayBuffer(a0);
  const a1 = new ArrayBuffer(100);
  const bs1 = ByteSequence.fromArrayBuffer(a1);
  const bs1b = ByteSequence.fromArrayBuffer(a1);

  assertNotStrictEquals(bs0.toArrayBuffer(), a0);
  assertNotStrictEquals(bs0.toArrayBuffer(), bs0b.buffer);
  assertNotStrictEquals(bs1.toArrayBuffer(), a1);
  assertNotStrictEquals(bs1.toArrayBuffer(), bs1b.buffer);
});

Deno.test("ByteSequence.prototype.toArrayBuffer - x", () => {
  // 返却値への操作は自身に影響しない
  const bs1 = ByteSequence.wrapArrayBuffer(new ArrayBuffer(100));

  const x = new Uint8Array(bs1.toArrayBuffer());
  assertStrictEquals(x[0], 0);

  x[0] = 255;
  assertStrictEquals(x[0], 255);
  assertNotStrictEquals(new Uint8Array(bs1.toArrayBuffer())[0], 255);
});

Deno.test("ByteSequence.fromArrayBufferView(Uint8Array)", () => {
  const a0 = Uint8Array.of(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
  const bs0 = ByteSequence.fromArrayBufferView(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.asUint8Array();
  assertStrictEquals(bs0a[0], 9);
  assertStrictEquals(bs0a[9], 0);

  const a1 = new Uint8Array(0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromArrayBufferView(*)", () => {
  assertThrows(
    () => {
      ByteSequence.fromArrayBufferView([] as unknown as Uint8Array);
    },
    TypeError,
    "bufferView",
  );
});

Deno.test("ByteSequence.fromBufferSource(ArrayBuffer)", () => {
  const a0 = Uint8Array.of(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
  const bs0 = ByteSequence.fromBufferSource(a0.buffer);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.asUint8Array();
  assertStrictEquals(bs0a[0], 9);
  assertStrictEquals(bs0a[9], 0);

  const a1 = new ArrayBuffer(0);
  const bs1 = ByteSequence.fromBufferSource(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBufferSource(Uint8Array)", () => {
  const a0 = Uint8Array.of(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
  const bs0 = ByteSequence.fromBufferSource(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.asUint8Array();
  assertStrictEquals(bs0a[0], 9);
  assertStrictEquals(bs0a[9], 0);

  const a1 = new Uint8Array(0);
  const bs1 = ByteSequence.fromBufferSource(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromArray(Array<number>)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 0, 255];
  const bs0 = ByteSequence.fromArray(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.asUint8Array();
  assertStrictEquals(bs0a[8], 0);
  assertStrictEquals(bs0a[9], 255);

  const a1: number[] = [];
  const bs1 = ByteSequence.fromArray(a1);

  assertStrictEquals(bs1.byteLength, 0);

  const a2 = ["a"];
  assertThrows(
    () => {
      ByteSequence.fromArray(a2 as unknown as number[]);
    },
    RangeError,
    "source[*]",
  );
});

Deno.test("ByteSequence.prototype.toArray()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals(bs0.toArray().length, 0);
  assertStrictEquals(bs1.toArray().length, 1000);

  const a2 = [1, 2, 3, 4, 5];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(JSON.stringify(a2), JSON.stringify(bs2.toArray()));
});

Deno.test("ByteSequence.from(ByteSequence)", () => {
  const bs0 = ByteSequence.allocate(100);
  const bs0c = ByteSequence.from(bs0);

  assertStrictEquals(bs0c.byteLength, 100);
  assertNotStrictEquals(bs0c, bs0);
});

Deno.test("ByteSequence.from(ArrayBuffer)", () => {
  const bs0 = ByteSequence.allocate(100);
  const bs0c = ByteSequence.from(bs0.buffer);

  assertStrictEquals(bs0c.byteLength, 100);
  assertNotStrictEquals(bs0c, bs0);
});

Deno.test("ByteSequence.from(ArrayBufferView)", () => {
  const bs0 = ByteSequence.allocate(100);
  const bs0c = ByteSequence.from(bs0.toUint8Array());

  assertStrictEquals(bs0c.byteLength, 100);
  assertNotStrictEquals(bs0c, bs0);
});

Deno.test("ByteSequence.from(number[])", () => {
  const bs0 = ByteSequence.allocate(100);
  const bs0c = ByteSequence.from(bs0.toArray());

  assertStrictEquals(bs0c.byteLength, 100);
  assertNotStrictEquals(bs0c, bs0);
});

Deno.test("ByteSequence.from(*)", () => {
  assertThrows(
    () => {
      ByteSequence.from(["1"] as unknown as number[]);
    },
    TypeError,
    "sourceBytes",
  );
});

Deno.test("ByteSequence.of(...number[])", () => {
  const bs0 = ByteSequence.allocate(100);
  const bs0c = ByteSequence.of(...bs0.toArray());

  assertStrictEquals(bs0c.byteLength, 100);
  assertNotStrictEquals(bs0c, bs0);
});

Deno.test("ByteSequence.generateRandom(number)", () => {
  const bs0 = ByteSequence.generateRandom(0);
  const bs1 = ByteSequence.generateRandom(65536);

  assertStrictEquals(bs0.buffer.byteLength, 0);
  assertStrictEquals(bs1.buffer.byteLength, 65536);

  assertThrows(
    () => {
      ByteSequence.generateRandom(-1);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      ByteSequence.generateRandom(1.5);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      ByteSequence.generateRandom(Number.NaN);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      ByteSequence.generateRandom(65537);
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.fromBinaryString(string)", () => {
  const binStr = "ABCD";
  const bsbs = ByteSequence.fromBinaryString(binStr);

  const bsa = bsbs.toArray();

  assertStrictEquals(bsa[0], 65);
  assertStrictEquals(bsa[1], 66);
  assertStrictEquals(bsa[2], 67);
  assertStrictEquals(bsa[3], 68);

  assertStrictEquals(ByteSequence.fromBinaryString("").byteLength, 0);
  assertStrictEquals(
    ByteSequence.fromBinaryString(undefined as unknown as string).byteLength,
    0,
  );

  assertThrows(
    () => {
      ByteSequence.fromBinaryString("あ");
    },
    RangeError,
    "input",
  );

  assertThrows(
    () => {
      ByteSequence.fromBinaryString("\u0100");
    },
    RangeError,
    "input",
  );
});

Deno.test("ByteSequence.prototype.toBinaryString()", () => {
  const binStr = "ABCD";
  const bsbs = ByteSequence.fromBinaryString(binStr);

  assertStrictEquals(bsbs.toBinaryString(), binStr);
});

Deno.test("ByteSequence.parse(string)", () => {
  const bs0 = ByteSequence.parse("41A24344");
  assertStrictEquals(bs0.toString(), "41A24344");
  assertStrictEquals(ByteSequence.parse("").toString(), "");

  const bs1 = ByteSequence.parse("41a24344");
  assertStrictEquals(bs1.toString(), "41A24344");

  assertThrows(
    () => {
      ByteSequence.parse("あ");
    },
    TypeError,
    "parse error: あ",
  );

  assertThrows(
    () => {
      ByteSequence.parse("GG");
    },
    TypeError,
    "parse error: GG",
  );
});

Deno.test("ByteSequence.parse(string, {radix:number})", () => {
  const bs0 = ByteSequence.parse("41424344", { radix: 16 });
  assertStrictEquals(bs0.toString(), "41424344");

  const bs1 = ByteSequence.parse("065066067068", { radix: 10 });
  assertStrictEquals(bs1.toString(), "41424344");

  const bs2 = ByteSequence.parse("101102103104", { radix: 8 });
  assertStrictEquals(bs2.toString(), "41424344");

  const bs3 = ByteSequence.parse("01000001010000100100001101000100", {
    radix: 2,
  });
  assertStrictEquals(bs3.toString(), "41424344");
});

Deno.test("ByteSequence.parse(string, FormatOptions)", () => {
  const bs0 = ByteSequence.parse("0041004200430044", {
    radix: 16,
    minIntegralDigits: 4,
    lowerCase: true,
  });
  assertStrictEquals(bs0.toString(), "41424344");
});

Deno.test("ByteSequence.prototype.format()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  assertStrictEquals(bs0.format(), "");
  assertStrictEquals(bs1.format(), "413C0A20A9");
});

Deno.test("ByteSequence.prototype.format({radix:number})", () => {
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  assertStrictEquals(bs1.format({ radix: 16 }), "413C0A20A9");
  assertStrictEquals(bs1.format({ radix: 10 }), "065060010032169");
});

Deno.test("ByteSequence.prototype.format(Options)", () => {
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  assertStrictEquals(bs1.format({ radix: 16, lowerCase: true }), "413c0a20a9");
  assertStrictEquals(
    bs1.format({ radix: 16, minIntegralDigits: 3, lowerCase: true }),
    "04103c00a0200a9",
  );
  assertStrictEquals(
    bs1.format({ radix: 10, minIntegralDigits: 4 }),
    "00650060001000320169",
  );
});

Deno.test("ByteSequence.fromBase64Encoded(string)", () => {
  const bs0 = ByteSequence.fromBase64Encoded("");
  assertStrictEquals(bs0.byteLength, 0);

  const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=");
  assertStrictEquals(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");
});

Deno.test("ByteSequence.fromBase64Encoded(string, Object)", () => {
  const bs0 = ByteSequence.fromBase64Encoded("", {});
  assertStrictEquals(bs0.byteLength, 0);

  const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=", {});
  assertStrictEquals(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

  const bs1b = ByteSequence.fromBase64Encoded(" A wIBAP/+/fw ", {});
  assertStrictEquals(bs1b.toArray().join(","), "3,2,1,0,255,254,253,252");

  const bs1c = ByteSequence.fromBase64Encoded("AwIBAP/+/fw", {
    noPadding: true,
  });
  assertStrictEquals(bs1c.toArray().join(","), "3,2,1,0,255,254,253,252");

  const rfc4648urlTable = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "-",
    "_",
  ];

  const bs2 = ByteSequence.fromBase64Encoded("AwIBAP_-_fw=", {
    table: rfc4648urlTable,
  });
  assertStrictEquals(bs2.toArray().join(","), "3,2,1,0,255,254,253,252");

  const bs2b = ByteSequence.fromBase64Encoded(" A wIBAP_-_fw ", {
    table: rfc4648urlTable,
  });
  assertStrictEquals(bs2b.toArray().join(","), "3,2,1,0,255,254,253,252");

  const bs2c = ByteSequence.fromBase64Encoded("AwIBAP_-_fw", {
    table: rfc4648urlTable,
    noPadding: true,
  });
  assertStrictEquals(bs2c.toArray().join(","), "3,2,1,0,255,254,253,252");
});

Deno.test("ByteSequence.prototype.toBase64Encoded()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3, 2, 1, 0, 255, 254, 253, 252]);

  const s1 = bs0.toBase64Encoded();
  assertStrictEquals(s1.length, 0);

  const s11 = bs1.toBase64Encoded();
  assertStrictEquals(s11, "AwIBAP/+/fw=");
});

Deno.test("ByteSequence.prototype.toBase64Encoded(Options)", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3, 2, 1, 0, 255, 254, 253, 252]);

  const s1 = bs0.toBase64Encoded({});
  assertStrictEquals(s1.length, 0);

  const s11 = bs1.toBase64Encoded({});
  assertStrictEquals(s11, "AwIBAP/+/fw=");

  const rfc4648urlTable = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "-",
    "_",
  ];

  const s11b = bs1.toBase64Encoded({ table: rfc4648urlTable });
  assertStrictEquals(s11b, "AwIBAP_-_fw=");

  const s11c = bs1.toBase64Encoded({ noPadding: true });
  assertStrictEquals(s11c, "AwIBAP/+/fw");
});

Deno.test("ByteSequence.fromPercentEncoded(string)", () => {
  const bs1 = ByteSequence.fromPercentEncoded("");
  assertStrictEquals(bs1.byteLength, 0);

  const bs2 = ByteSequence.fromPercentEncoded("%03");
  assertStrictEquals(bs2.asUint8Array()[0], 0x03);
});

Deno.test("ByteSequence.fromPercentEncoded(string, Options)", () => {
  const bs0 = ByteSequence.fromPercentEncoded("", {});
  assertStrictEquals(bs0.byteLength, 0);
});

Deno.test("ByteSequence.prototype.toPercentEncoded()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3, 2, 1, 0, 255, 254, 253, 252]);

  const s1 = bs0.toPercentEncoded();
  assertStrictEquals(s1.length, 0);

  const s11 = bs1.toPercentEncoded();
  assertStrictEquals(s11, "%03%02%01%00%FF%FE%FD%FC");
});

Deno.test("ByteSequence.prototype.toPercentEncoded(Options)", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3, 2, 1, 0, 255, 254, 253, 252]);
  const bs3 = ByteSequence.fromArray([0x20, 0x21, 0x22, 0x23]);

  const s1 = bs0.toPercentEncoded({});
  assertStrictEquals(s1.length, 0);

  const s11 = bs1.toPercentEncoded({});
  assertStrictEquals(s11, "%03%02%01%00%FF%FE%FD%FC");

  const s3a = bs3.toPercentEncoded({ spaceAsPlus: true });
  assertStrictEquals(s3a, "+%21%22%23");

  const s3b = bs3.toPercentEncoded({ encodeSet: [] });
  assertStrictEquals(s3b, ' !"#');
});

Deno.test("ByteSequence.prototype.toMd5Digest()", async () => {
  const bs0 = ByteSequence.allocate(0);
  const s1 = await bs0.toMd5Digest();
  assertStrictEquals(
    s1.format(),
    "D41D8CD98F00B204E9800998ECF8427E",
  );

  const bs0b = ByteSequence.of(
    0xE5,
    0xAF,
    0x8C,
    0xE5,
    0xA3,
    0xAB,
    0xE5,
    0xB1,
    0xB1,
  );
  const s1b = await bs0b.toMd5Digest();
  assertStrictEquals(
    s1b.format(),
    "52A6AD27415BD86EC64B57EFBEA27F98",
  );
});

Deno.test("ByteSequence.prototype.toSha1Digest()", async () => {
  const bs0 = ByteSequence.allocate(0);
  const s1 = await bs0.toSha1Digest();
  assertStrictEquals(
    s1.format(),
    "DA39A3EE5E6B4B0D3255BFEF95601890AFD80709",
  );

  const bs0b = ByteSequence.of(
    0xE5,
    0xAF,
    0x8C,
    0xE5,
    0xA3,
    0xAB,
    0xE5,
    0xB1,
    0xB1,
  );
  const s1b = await bs0b.toSha1Digest();
  assertStrictEquals(
    s1b.format(),
    "BD6691181693B56B7BC70FE5B4E603EAAA598538",
  );
});

Deno.test("ByteSequence.prototype.toSha256Digest()", async () => {
  const bs0 = ByteSequence.allocate(0);
  const s1 = await bs0.toSha256Digest();
  assertStrictEquals(
    s1.format(),
    "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
  );

  const bs0b = ByteSequence.of(
    0xE5,
    0xAF,
    0x8C,
    0xE5,
    0xA3,
    0xAB,
    0xE5,
    0xB1,
    0xB1,
  );
  const s1b = await bs0b.toSha256Digest();
  assertStrictEquals(
    s1b.format(),
    "E294AB9D429F9A9A2678D996E5DBD40CBF62363A5ED417F654C5F0BA861E4200",
  );
});

Deno.test("ByteSequence.prototype.toSha384Digest()", async () => {
  const bs0 = ByteSequence.allocate(0);
  const s1 = await bs0.toSha384Digest();
  assertStrictEquals(
    s1.format(),
    "38B060A751AC96384CD9327EB1B1E36A21FDB71114BE07434C0CC7BF63F6E1DA274EDEBFE76F65FBD51AD2F14898B95B",
  );

  const bs0b = ByteSequence.of(
    0xE5,
    0xAF,
    0x8C,
    0xE5,
    0xA3,
    0xAB,
    0xE5,
    0xB1,
    0xB1,
  );
  const s1b = await bs0b.toSha384Digest();
  assertStrictEquals(
    s1b.format(),
    "0DFB62B1F4A0DE2DE526E470CC00B654001B9D43012931466F049436C1C5CC13145972340B26D8F6A83C7FE2E942C3F3",
  );
});

Deno.test("ByteSequence.prototype.toSha512Digest()", async () => {
  const bs0 = ByteSequence.allocate(0);
  const s1 = await bs0.toSha512Digest();
  assertStrictEquals(
    s1.format(),
    "CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E",
  );

  const bs0b = ByteSequence.of(
    0xE5,
    0xAF,
    0x8C,
    0xE5,
    0xA3,
    0xAB,
    0xE5,
    0xB1,
    0xB1,
  );
  const s1b = await bs0b.toSha512Digest();
  assertStrictEquals(
    s1b.format(),
    "79DD60E264A2B6E763625B25A42CE21F3994F64423D779191878FF3D5D9ED597F663664A5411AF33FE48D9ED87E011ADDE6BCD412EA29AC6288E4AB1D8730847",
  );
});

const MD5 = {
  compute(input: BufferSource): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
      const md5 = new Md5();
      const digest = md5.update(
        ArrayBuffer.isView(input) ? input.buffer : input,
      ).digest();
      resolve(digest);
    });
  },
};

Deno.test("ByteSequence.prototype.toDigest({})", async () => {
  const bs0 = ByteSequence.allocate(0);

  const s1 = await bs0.toDigest(MD5);
  assertStrictEquals(s1.format(), "D41D8CD98F00B204E9800998ECF8427E");
});

Deno.test("ByteSequence.prototype.toString()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  assertStrictEquals(bs0.toString(), "");
  assertStrictEquals(bs1.toString(), "413C0A20A9");
});

Deno.test("ByteSequence.prototype.toJSON()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals(bs0.toJSON().length, 0);
  assertStrictEquals(bs1.toJSON().length, 1000);

  const a2 = [1, 2, 3, 4, 5];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(JSON.stringify(a2), JSON.stringify(bs2.toJSON()));
});

Deno.test("ByteSequence.fromText(string)", () => {
  const bs1 = ByteSequence.fromText("");
  assertStrictEquals(bs1.byteLength, 0);

  const bs2 = ByteSequence.fromText("1あ3\u{A9}");
  assertStrictEquals(bs2.toArray().join(","), "49,227,129,130,51,194,169");
});

const eucjp = {
  encode(input = ""): Uint8Array {
    const utf8Bytes = new TextEncoder().encode(input);
    const eucjpBytes = encja.convert(utf8Bytes, {
      from: "UTF8",
      to: "EUCJP",
      type: "arraybuffer",
    });
    return new Uint8Array(eucjpBytes);
  },
};

Deno.test("ByteSequence.fromText(string, Object)", () => {
  const bs1 = ByteSequence.fromText("", eucjp);
  assertStrictEquals(bs1.byteLength, 0);

  const bs2 = ByteSequence.fromText("あいうえお", eucjp);
  assertStrictEquals(
    bs2.toArray().join(","),
    "164,162,164,164,164,166,164,168,164,170",
  );
});

Deno.test("ByteSequence.prototype.toText()", () => {
  const bs1 = ByteSequence.fromArray([49, 227, 129, 130, 51, 194, 169]);
  assertStrictEquals(bs1.toText(), "1あ3\u{A9}");
});

Deno.test("ByteSequence.prototype.toText(Object)", () => {
  const eucJpDecoder = new TextDecoder("euc-jp");

  const bs1 = ByteSequence.fromArray([
    164,
    162,
    164,
    164,
    164,
    166,
    164,
    168,
    164,
    170,
  ]);
  assertStrictEquals(bs1.toText(eucJpDecoder), "あいうえお");
});

Deno.test("ByteSequence.fromBlob(Blob)", async () => {
  const b1 = new Blob([Uint8Array.of(255, 0, 1, 127)], { type: "text/plain" });

  const b11 = await ByteSequence.fromBlob(b1);
  const b11v = b11.asUint8Array();
  assertStrictEquals(b11v[0], 255);
  assertStrictEquals(b11v[1], 0);
  assertStrictEquals(b11v[2], 1);
  assertStrictEquals(b11v[3], 127);
  assertStrictEquals(b11.byteLength, 4);

  const b2 = new Blob([Uint8Array.of(255, 0, 1, 127)]);

  const b21 = await ByteSequence.fromBlob(b2);
  const b21v = b21.asUint8Array();
  assertStrictEquals(b21v[0], 255);
  assertStrictEquals(b21v[1], 0);
  assertStrictEquals(b21v[2], 1);
  assertStrictEquals(b21v[3], 127);
  assertStrictEquals(b21.byteLength, 4);
});

Deno.test("ByteSequence.withMetadataFromBlob(Blob)", async () => {
  const b1 = new Blob([Uint8Array.of(255, 0, 1, 127)], { type: "text/plain" });

  const { data: b11, options: meta11 } = await ByteSequence
    .withMetadataFromBlob(
      b1,
    );
  const b11v = b11.asUint8Array();
  assertStrictEquals(b11v[0], 255);
  assertStrictEquals(b11v[1], 0);
  assertStrictEquals(b11v[2], 1);
  assertStrictEquals(b11v[3], 127);
  assertStrictEquals(b11.byteLength, 4);
  assertStrictEquals(JSON.stringify(meta11), `{"type":"text/plain"}`);

  const b2 = new Blob([Uint8Array.of(255, 0, 1, 127)]);

  const { data: b21, options: meta21 } = await ByteSequence
    .withMetadataFromBlob(
      b2,
    );
  const b21v = b21.asUint8Array();
  assertStrictEquals(b21v[0], 255);
  assertStrictEquals(b21v[1], 0);
  assertStrictEquals(b21v[2], 1);
  assertStrictEquals(b21v[3], 127);
  assertStrictEquals(b21.byteLength, 4);
  assertStrictEquals(meta21, undefined);
});

Deno.test("ByteSequence.prototype.toBlob()", async () => {
  const b1 = new Blob([Uint8Array.of(255, 0, 1, 127)], { type: "text/plain" });

  const { data: b11, options: meta11 } = await ByteSequence
    .withMetadataFromBlob(
      b1,
    );
  const b11b = b11.toBlob(meta11);
  const b11r = await b11b.arrayBuffer();
  assertStrictEquals([...new Uint8Array(b11r)].join(","), "255,0,1,127");
  assertStrictEquals(b11b.type, "text/plain");

  const b2 = new Blob([Uint8Array.of(255, 0, 1, 127)]);

  const { data: b21 } = await ByteSequence.withMetadataFromBlob(b2);
  const b21b = b21.toBlob();
  const b21r = await b21b.arrayBuffer();
  assertStrictEquals([...new Uint8Array(b21r)].join(","), "255,0,1,127");
  assertStrictEquals(b21b.type, "");
});

Deno.test("ByteSequence.prototype.toBlob({})", async () => {
  const b1 = new Blob([Uint8Array.of(255, 0, 1, 127)], { type: "text/plain" });

  const { data: b11 } = await ByteSequence.withMetadataFromBlob(b1);
  const b11b = b11.toBlob({ type: "application/pdf" });
  const b11r = await b11b.arrayBuffer();
  assertStrictEquals([...new Uint8Array(b11r)].join(","), "255,0,1,127");
  assertStrictEquals(b11b.type, "application/pdf");

  const b2 = new Blob([Uint8Array.of(255, 0, 1, 127)]);

  const { data: b21 } = await ByteSequence.withMetadataFromBlob(b2);
  const b21b = b21.toBlob({ type: "text/html; charset=utf-8" });
  const b21r = await b21b.arrayBuffer();
  assertStrictEquals([...new Uint8Array(b21r)].join(","), "255,0,1,127");
  assertStrictEquals(b21b.type, "text/html;charset=utf-8");
});

Deno.test("ByteSequence.prototype.toFile(string)", async () => {
  if ("File" in globalThis) {
    const b1 = new File([Uint8Array.of(255, 0, 1, 127)], "test.txt", {
      type: "text/plain",
    });

    const { data: b11 } = await ByteSequence.withMetadataFromBlob(b1);
    const b11b = b11.toFile("test.txt");
    const b11r = await b11b.arrayBuffer();
    assertStrictEquals([...new Uint8Array(b11r)].join(","), "255,0,1,127");
    assertStrictEquals(b11b.type, "");
    assertStrictEquals(b11b.name, "test.txt");

    const b2 = new Blob([Uint8Array.of(255, 0, 1, 127)]);
    const { data: b21 } = await ByteSequence.withMetadataFromBlob(b2);

    assertThrows(
      () => {
        b21.toFile(undefined as unknown as string);
      },
      TypeError,
      "fileName",
    );
  } else {
    assertStrictEquals(0, 0);
  }
});

Deno.test("ByteSequence.prototype.toFile(string)", async () => {
  if ("File" in globalThis) {
    const b1 = new File([Uint8Array.of(255, 0, 1, 127)], "test.txt", {
      type: "text/plain",
    });

    const { data: b11 } = await ByteSequence.withMetadataFromBlob(b1);
    const b11b = b11.toFile("a.xml");
    const b11r = await b11b.arrayBuffer();
    assertStrictEquals([...new Uint8Array(b11r)].join(","), "255,0,1,127");
    assertStrictEquals(b11b.type, "");
    assertStrictEquals(b11b.name, "a.xml");

    const b2 = new Blob([Uint8Array.of(255, 0, 1, 127)]);
    const { data: b21 } = await ByteSequence.withMetadataFromBlob(b2);
    const b21b = b21.toFile("a.xml");
    const b21r = await b21b.arrayBuffer();
    assertStrictEquals([...new Uint8Array(b21r)].join(","), "255,0,1,127");
    assertStrictEquals(b21b.type, "");
    assertStrictEquals(b21b.name, "a.xml");
  } else {
    assertStrictEquals(0, 0);
  }
});

Deno.test("ByteSequence.prototype.toFile(string, string)", async () => {
  if ("File" in globalThis) {
    const b1 = new File([Uint8Array.of(255, 0, 1, 127)], "test.txt", {
      type: "text/plain",
    });

    const { data: b11 } = await ByteSequence.withMetadataFromBlob(b1);
    const b11b = b11.toFile("a.xml", {
      type: "application/xml",
      lastModified: Date.parse("2021-02-03T04:05:06Z"),
    });
    const b11r = await b11b.arrayBuffer();
    assertStrictEquals([...new Uint8Array(b11r)].join(","), "255,0,1,127");
    assertStrictEquals(b11b.type, "application/xml");
    assertStrictEquals(b11b.name, "a.xml");
    assertStrictEquals(b11b.lastModified, Date.parse("2021-02-03T04:05:06Z"));
  } else {
    assertStrictEquals(0, 0);
  }
});

Deno.test("ByteSequence.fromDataURL(string)", () => {
  const b0 = ByteSequence.fromDataURL("data:text/plain,");
  assertStrictEquals(b0.byteLength, 0);

  const b0b = ByteSequence.fromDataURL("data:text/plain;base64,");
  assertStrictEquals(b0b.byteLength, 0);

  const b0c = ByteSequence.fromDataURL("data: ,");
  assertStrictEquals(b0c.byteLength, 0);

  const b0d = ByteSequence.fromDataURL("data: ; ,");
  assertStrictEquals(b0d.byteLength, 0);

  const b0e = ByteSequence.fromDataURL("data: ; x=y ,");
  assertStrictEquals(b0e.byteLength, 0);

  const b11 = ByteSequence.fromDataURL("data:text/plain,a1");
  const b11v = b11.asUint8Array();
  assertStrictEquals(b11v[0], 97);
  assertStrictEquals(b11v[1], 49);
  assertStrictEquals(b11.byteLength, 2);

  const b12 = ByteSequence.fromDataURL(
    "data:application/octet-stream;base64,AwIBAP/+/fw=",
  );
  const b12v = b12.asUint8Array();
  assertStrictEquals(b12v[0], 3);
  assertStrictEquals(b12v[1], 2);
  assertStrictEquals(b12v[2], 1);
  assertStrictEquals(b12v[3], 0);
  assertStrictEquals(b12v[4], 255);
  assertStrictEquals(b12v[5], 254);
  assertStrictEquals(b12v[6], 253);
  assertStrictEquals(b12v[7], 252);
  assertStrictEquals(b12.byteLength, 8);

  const b21 = ByteSequence.fromDataURL("data:text/plain; p1=a,a1");
  const b21v = b21.asUint8Array();
  assertStrictEquals(b21v[0], 97);
  assertStrictEquals(b21v[1], 49);
  assertStrictEquals(b21.byteLength, 2);

  const b22 = ByteSequence.fromDataURL('data:text/plain; p1=a;p2="b,c",a1');
  const b22v = b22.asUint8Array();
  assertStrictEquals(b22v[0], 99);
  assertStrictEquals(b22v[1], 34);
  assertStrictEquals(b22v[2], 44);
  assertStrictEquals(b22v[3], 97);
  assertStrictEquals(b22v[4], 49);
  assertStrictEquals(b22.byteLength, 5);

  const b31 = ByteSequence.fromDataURL("data:text/plain,%FF%");
  const b31v = b31.asUint8Array();
  assertStrictEquals(b31v[0], 255);
  assertStrictEquals(b31v[1], 0x25);
  assertStrictEquals(b31.byteLength, 2);

  const b32 = ByteSequence.fromDataURL("data:text/plain,%fff");
  const b32v = b32.asUint8Array();
  assertStrictEquals(b32v[0], 255);
  assertStrictEquals(b32v[1], 0x66);
  assertStrictEquals(b32.byteLength, 2);

  const b33 = ByteSequence.fromDataURL("data:text/plain,a?a=2");
  const b33v = b33.asUint8Array();
  assertStrictEquals(b33v[0], 0x61);
  assertStrictEquals(b33v[1], 0x3F);
  assertStrictEquals(b33v[2], 0x61);
  assertStrictEquals(b33v[3], 0x3D);
  assertStrictEquals(b33v[4], 0x32);
  assertStrictEquals(b33.byteLength, 5);

  assertThrows(
    () => {
      ByteSequence.fromDataURL("data:text/plain");
    },
    TypeError,
    "U+002C not found",
  );

  assertThrows(
    () => {
      ByteSequence.fromDataURL("data2:text/plain");
    },
    TypeError,
    `URL scheme is not "data"`,
  );

  assertThrows(
    () => {
      ByteSequence.fromDataURL("");
    },
    TypeError,
    "dataUrlStr does not reperesent URL",
  );
});

Deno.test("ByteSequence.fromDataURL(URL)", () => {
  const b11 = ByteSequence.fromDataURL(new URL("data:text/plain,a1"));
  const b11v = b11.asUint8Array();
  assertStrictEquals(b11v[0], 97);
  assertStrictEquals(b11v[1], 49);
  assertStrictEquals(b11.byteLength, 2);
});

Deno.test("ByteSequence.withMetadataFromDataURL(string)", () => {
  const { data: b0, options: meta0 } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain,",
  );
  assertStrictEquals(b0.byteLength, 0);
  assertStrictEquals(JSON.stringify(meta0), `{"type":"text/plain"}`);

  const { data: b0b, options: meta0b } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain;base64,",
  );
  assertStrictEquals(b0b.byteLength, 0);
  assertStrictEquals(JSON.stringify(meta0b), `{"type":"text/plain"}`);

  const { data: b0c, options: meta0c } = ByteSequence.withMetadataFromDataURL(
    "data: ,",
  );
  assertStrictEquals(b0c.byteLength, 0);
  assertStrictEquals(
    JSON.stringify(meta0c),
    `{"type":"text/plain;charset=US-ASCII"}`,
  );

  const { data: b0d, options: meta0d } = ByteSequence.withMetadataFromDataURL(
    "data: ; ,",
  );
  assertStrictEquals(b0d.byteLength, 0);
  assertStrictEquals(JSON.stringify(meta0d), `{"type":"text/plain"}`);

  const { data: b0e, options: meta0e } = ByteSequence.withMetadataFromDataURL(
    "data: ; x=y ,",
  );
  assertStrictEquals(b0e.byteLength, 0);
  assertStrictEquals(JSON.stringify(meta0e), `{"type":"text/plain;x=y"}`);

  const { data: b11, options: meta11 } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain,a1",
  );
  const b11v = b11.asUint8Array();
  assertStrictEquals(b11v[0], 97);
  assertStrictEquals(b11v[1], 49);
  assertStrictEquals(b11.byteLength, 2);
  assertStrictEquals(JSON.stringify(meta11), `{"type":"text/plain"}`);

  const { data: b12, options: meta12 } = ByteSequence.withMetadataFromDataURL(
    "data:application/octet-stream;base64,AwIBAP/+/fw=",
  );
  const b12v = b12.asUint8Array();
  assertStrictEquals(b12v[0], 3);
  assertStrictEquals(b12v[1], 2);
  assertStrictEquals(b12v[2], 1);
  assertStrictEquals(b12v[3], 0);
  assertStrictEquals(b12v[4], 255);
  assertStrictEquals(b12v[5], 254);
  assertStrictEquals(b12v[6], 253);
  assertStrictEquals(b12v[7], 252);
  assertStrictEquals(b12.byteLength, 8);
  assertStrictEquals(
    JSON.stringify(meta12),
    `{"type":"application/octet-stream"}`,
  );

  const { data: b21, options: meta21 } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain; p1=a,a1",
  );
  const b21v = b21.asUint8Array();
  assertStrictEquals(b21v[0], 97);
  assertStrictEquals(b21v[1], 49);
  assertStrictEquals(b21.byteLength, 2);
  assertStrictEquals(JSON.stringify(meta21), `{"type":"text/plain;p1=a"}`);

  const { data: b22, options: meta22 } = ByteSequence.withMetadataFromDataURL(
    'data:text/plain; p1=a;p2="b,c",a1',
  );
  const b22v = b22.asUint8Array();
  assertStrictEquals(b22v[0], 99);
  assertStrictEquals(b22v[1], 34);
  assertStrictEquals(b22v[2], 44);
  assertStrictEquals(b22v[3], 97);
  assertStrictEquals(b22v[4], 49);
  assertStrictEquals(b22.byteLength, 5);
  assertStrictEquals(JSON.stringify(meta22), `{"type":"text/plain;p1=a;p2=b"}`);

  const { data: b31, options: meta31 } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain,%FF%",
  );
  const b31v = b31.asUint8Array();
  assertStrictEquals(b31v[0], 255);
  assertStrictEquals(b31v[1], 0x25);
  assertStrictEquals(b31.byteLength, 2);
  assertStrictEquals(JSON.stringify(meta31), `{"type":"text/plain"}`);

  const { data: b32, options: meta32 } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain,%fff",
  );
  const b32v = b32.asUint8Array();
  assertStrictEquals(b32v[0], 255);
  assertStrictEquals(b32v[1], 0x66);
  assertStrictEquals(b32.byteLength, 2);
  assertStrictEquals(JSON.stringify(meta32), `{"type":"text/plain"}`);

  const { data: b33, options: meta33 } = ByteSequence.withMetadataFromDataURL(
    "data:text/plain,a?a=2",
  );
  const b33v = b33.asUint8Array();
  assertStrictEquals(b33v[0], 0x61);
  assertStrictEquals(b33v[1], 0x3F);
  assertStrictEquals(b33v[2], 0x61);
  assertStrictEquals(b33v[3], 0x3D);
  assertStrictEquals(b33v[4], 0x32);
  assertStrictEquals(b33.byteLength, 5);
  assertStrictEquals(JSON.stringify(meta33), `{"type":"text/plain"}`);

  assertThrows(
    () => {
      ByteSequence.withMetadataFromDataURL("data:text/plain");
    },
    TypeError,
    "U+002C not found",
  );

  assertThrows(
    () => {
      ByteSequence.withMetadataFromDataURL("data2:text/plain");
    },
    TypeError,
    `URL scheme is not "data"`,
  );

  assertThrows(
    () => {
      ByteSequence.withMetadataFromDataURL("");
    },
    TypeError,
    "dataUrlStr does not reperesent URL",
  );
});

Deno.test("ByteSequence.withMetadataFromDataURL(URL)", () => {
  const { data: b11, options: meta11 } = ByteSequence.withMetadataFromDataURL(
    new URL("data:text/plain,a1"),
  );
  const b11v = b11.asUint8Array();
  assertStrictEquals(b11v[0], 97);
  assertStrictEquals(b11v[1], 49);
  assertStrictEquals(b11.byteLength, 2);
  assertStrictEquals(JSON.stringify(meta11), `{"type":"text/plain"}`);
});

Deno.test("ByteSequence.prototype.toDataURL()", async () => {
  const b1 = new Blob([Uint8Array.of(65, 0, 1, 127)], { type: "text/plain" });
  const { data: b11, options: meta11 } = await ByteSequence
    .withMetadataFromBlob(
      b1,
    );
  const b11b = b11.toDataURL(meta11);

  assertStrictEquals(b11b.toString(), "data:text/plain;base64,QQABfw==");

  const b2 = new Blob([Uint8Array.of(65, 0, 1, 127)]);
  const { data: b21 } = await ByteSequence.withMetadataFromBlob(b2);
  assertThrows(
    () => {
      b21.toDataURL();
    },
    TypeError,
    "MIME type not resolved",
  );
});

Deno.test("ByteSequence.prototype.toDataURL({})", async () => {
  const b1 = new Blob([Uint8Array.of(65, 0, 1, 127)], { type: "text/plain" });
  const { data: b11 } = await ByteSequence.withMetadataFromBlob(b1);
  const b11b = b11.toDataURL({ type: "application/pdf" });

  assertStrictEquals(b11b.toString(), "data:application/pdf;base64,QQABfw==");

  const b2 = new Blob([Uint8Array.of(65, 0, 1, 127)]);
  const { data: b21 } = await ByteSequence.withMetadataFromBlob(b2);
  const b21b = b21.toDataURL({ type: "application/pdf" });
  assertStrictEquals(b21b.toString(), "data:application/pdf;base64,QQABfw==");
});

Deno.test("ByteSequence.prototype.duplicate()", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals(bs0.duplicate().byteLength, 0);
  assertNotStrictEquals(bs0.duplicate().buffer, bs0.buffer);
  assertStrictEquals(bs0.duplicate().toString(), bs0.toString());

  assertStrictEquals(bs1.duplicate().byteLength, 1000);
  assertNotStrictEquals(bs1.duplicate().buffer, bs1.buffer);
  assertStrictEquals(bs1.duplicate().toString(), bs1.toString());

  const a2 = [1, 2, 3, 4, 5];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(
    JSON.stringify(a2),
    JSON.stringify(bs2.duplicate().toArray()),
  );
});

Deno.test("ByteSequence.prototype.subsequence()", () => {
  const bs0 = ByteSequence.allocate(0);

  assertThrows(
    () => {
      bs0.subsequence(undefined as unknown as number);
    },
    TypeError,
    "start",
  );
});

Deno.test("ByteSequence.prototype.subsequence(number)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.generateRandom(1000);

  assertStrictEquals(bs0.subsequence(0).byteLength, 0);
  assertNotStrictEquals(bs0.subsequence(0).buffer, bs0.buffer);
  assertStrictEquals(bs0.subsequence(0).toString(), bs0.toString());

  assertStrictEquals(bs1.subsequence(0).byteLength, 1000);
  assertStrictEquals(bs1.subsequence(999).byteLength, 1);
  assertStrictEquals(bs1.subsequence(1000).byteLength, 0);
  assertNotStrictEquals(bs1.subsequence(0).buffer, bs1.buffer);
  assertStrictEquals(bs1.subsequence(0).toString(), bs1.toString());

  const a2 = [1, 2, 3, 4, 5];
  const bs2 = ByteSequence.fromArray(a2);
  assertStrictEquals(
    JSON.stringify(a2),
    JSON.stringify(bs2.subsequence(0).toArray()),
  );

  assertThrows(
    () => {
      bs1.subsequence(1001);
    },
    RangeError,
    "start",
  );
});

Deno.test("ByteSequence.prototype.subsequence(number, number)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.generateRandom(1000);

  assertStrictEquals(bs0.subsequence(0, 0).byteLength, 0);
  assertStrictEquals(bs0.subsequence(0, 1).byteLength, 0);
  assertNotStrictEquals(bs0.subsequence(0, 0).buffer, bs0.buffer);
  assertStrictEquals(bs0.subsequence(0, 0).toString(), bs0.toString());

  assertStrictEquals(bs1.subsequence(0, 1000).byteLength, 1000);
  assertStrictEquals(bs1.subsequence(999, 1000).byteLength, 1);
  assertStrictEquals(bs1.subsequence(1000, 1000).byteLength, 0);
  assertStrictEquals(bs1.subsequence(1000, 1001).byteLength, 0);
  assertNotStrictEquals(bs1.subsequence(0, 1000).buffer, bs1.buffer);
  assertStrictEquals(bs1.subsequence(0, 1000).toString(), bs1.toString());
  assertStrictEquals(bs1.subsequence(0, 1001).toString(), bs1.toString());

  assertStrictEquals(
    bs1.subsequence(100, 200).toString(),
    ByteSequence.fromArrayBufferView(bs1.asUint8Array(100, 100))
      .toString(),
  );

  assertThrows(
    () => {
      bs1.subsequence(1, -1);
    },
    TypeError,
    "end",
  );

  assertThrows(
    () => {
      bs1.subsequence(2, 1);
    },
    RangeError,
    "end",
  );
});

Deno.test("ByteSequence.prototype.asUint8Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asUint8Array();
  const v2 = bs1.asUint8Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1 instanceof Uint8Array, true);
  assertNotStrictEquals(v1, v2);

  v1[0] = 255;
  assertStrictEquals(v2[0], 255);
});

Deno.test("ByteSequence.prototype.asUint8Array(number)", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asUint8Array(500);
  assertStrictEquals(v1.byteLength, 500);

  v1[0] = 255;
  assertStrictEquals(bs1.asUint8Array()[500], 255);
});

Deno.test("ByteSequence.prototype.asUint8Array(number, number)", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asUint8Array(500, 1);
  assertStrictEquals(v1.byteLength, 1);
});

Deno.test("ByteSequence.prototype.asUint8ClampedArray()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asUint8ClampedArray();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 1000);
  assertStrictEquals(v1 instanceof Uint8ClampedArray, true);
});

Deno.test("ByteSequence.prototype.asInt8Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asInt8Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 1000);
  assertStrictEquals(v1 instanceof Int8Array, true);
});

Deno.test("ByteSequence.prototype.asUint16Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asUint16Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 500);
  assertStrictEquals(v1 instanceof Uint16Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(1).asUint16Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(3).asUint16Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asInt16Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asInt16Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 500);
  assertStrictEquals(v1 instanceof Int16Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(1).asInt16Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(3).asInt16Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asUint32Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asUint32Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 250);
  assertStrictEquals(v1 instanceof Uint32Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(3).asUint32Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(5).asUint32Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asInt32Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asInt32Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 250);
  assertStrictEquals(v1 instanceof Int32Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(3).asInt32Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(5).asInt32Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asFloat32Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asFloat32Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 250);
  assertStrictEquals(v1 instanceof Float32Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(3).asFloat32Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(5).asFloat32Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asFloat64Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asFloat64Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 125);
  assertStrictEquals(v1 instanceof Float64Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(7).asFloat64Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(9).asFloat64Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asBigUint64Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asBigUint64Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 125);
  assertStrictEquals(v1 instanceof BigUint64Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(7).asBigUint64Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(9).asBigUint64Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asBigInt64Array()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asBigInt64Array();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1.length, 125);
  assertStrictEquals(v1 instanceof BigInt64Array, true);

  assertThrows(
    () => {
      ByteSequence.allocate(7).asBigInt64Array();
    },
    RangeError,
    "byteLength",
  );
  assertThrows(
    () => {
      ByteSequence.allocate(9).asBigInt64Array();
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.asDataView()", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asDataView();
  const v2 = bs1.asDataView();
  assertStrictEquals(v1.byteLength, 1000);
  assertStrictEquals(v1 instanceof DataView, true);
  assertNotStrictEquals(v1, v2);

  v1.setUint8(0, 255);
  assertStrictEquals(v2.getUint8(0), 255);
});

Deno.test("ByteSequence.prototype.asDataView(number)", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asDataView(500);
  assertStrictEquals(v1.byteLength, 500);

  v1.setUint8(0, 255);
  assertStrictEquals(bs1.asDataView().getUint8(500), 255);
});

Deno.test("ByteSequence.prototype.asDataView(number, number)", () => {
  const bs1 = ByteSequence.allocate(1000);
  const v1 = bs1.asDataView(500, 1);
  assertStrictEquals(v1.byteLength, 1);
});

Deno.test("ByteSequence.prototype.getView()", () => {
  const bs1 = ByteSequence.allocate(1000);
  assertStrictEquals(bs1.getView().byteLength, 1000);
});

Deno.test("ByteSequence.prototype.getView(Uint8Array)", () => {
  const bs1 = ByteSequence.allocate(1000);
  assertStrictEquals(bs1.getView(Uint8Array).byteLength, 1000);
});

Deno.test("ByteSequence.prototype.getView(DataView)", () => {
  const bs1 = ByteSequence.allocate(1000);
  assertStrictEquals(bs1.getView(DataView).byteLength, 1000);
});

Deno.test("ByteSequence.prototype.getView(*)", () => {
  const bs1 = ByteSequence.allocate(1000);
  assertThrows(
    () => {
      bs1.getView(Blob as unknown as Uint8ArrayConstructor);
    },
    TypeError,
    "ctor",
  );
});

Deno.test("ByteSequence.prototype.getView({}, number)", () => {
  const bs1 = ByteSequence.allocate(1000);
  assertStrictEquals(bs1.getView(Uint8Array, 0).byteLength, 1000);
  assertStrictEquals(bs1.getView(Uint8Array, 500).byteLength, 500);
});

Deno.test("ByteSequence.prototype.getView({}, number, number)", () => {
  const bs1 = ByteSequence.allocate(1000);

  assertStrictEquals(bs1.getView(Uint8Array, 0, 1).byteLength, 1);
  assertStrictEquals(bs1.getView(Uint8Array, 0, 1000).byteLength, 1000);
  assertStrictEquals(bs1.getView(Uint8Array, 1, 999).byteLength, 999);
  assertStrictEquals(bs1.getView(Uint8Array, 999, 1).byteLength, 1);
  assertStrictEquals(bs1.getView(Uint8Array, 1000, 0).byteLength, 0);
  assertStrictEquals(bs1.getView(Uint8Array, 0, 0).byteLength, 0);

  assertThrows(
    () => {
      bs1.getView(Uint8Array, -1, 1);
    },
    TypeError,
    "byteOffset",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, 1001, 1);
    },
    RangeError,
    "byteOffset",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, Number.NaN, 1);
    },
    TypeError,
    "byteOffset",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, 1.5, 1);
    },
    TypeError,
    "byteOffset",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, 0, Number.NaN);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, 0, 1.5);
    },
    TypeError,
    "byteLength",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, 0, 1001);
    },
    RangeError,
    "byteLength",
  );

  assertThrows(
    () => {
      bs1.getView(Uint8Array, 999, 2);
    },
    RangeError,
    "byteLength",
  );
});

Deno.test("ByteSequence.prototype.getView - x1", () => {
  // fromメソッドに渡したインスタンスとは異なるインスタンスが返る
  const b0 = new Uint8Array(0);
  const bs0 = ByteSequence.fromArrayBufferView(b0);
  assertNotStrictEquals(bs0.getView(Uint8Array, 0, 0), b0);
});

Deno.test("ByteSequence.prototype.getView - x2", () => {
  // 返却値への操作は自身に影響する
  const bs1 = ByteSequence.allocate(100);

  const x = bs1.getView(Uint8Array, 0, 100);
  assertStrictEquals(x[0], 0);

  x[0] = 255;
  assertStrictEquals(x[0], 255);
  assertStrictEquals(new Uint8Array(bs1.buffer)[0], 255);

  x[0] = 32;
  assertStrictEquals(x[0], 32);
  assertStrictEquals(new Uint8Array(bs1.buffer)[0], 32);
});

Deno.test("ByteSequence.prototype.equals(ByteSequence)", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs0b = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b = ByteSequence.fromArray([255, 0, 127, 1]);

  assertStrictEquals(bs0.equals(bs0), true);
  assertStrictEquals(bs0.equals(bs0b), true);

  assertStrictEquals(bs1.equals(bs1), true);
  assertStrictEquals(bs1.equals(bs1b), true);
  assertStrictEquals(bs1.equals(bs0), false);
  assertStrictEquals(bs0.equals(bs1), false);
});

Deno.test("ByteSequence.prototype.equals(Uint8Array)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));

  assertStrictEquals(bs0.equals(new Uint8Array(0)), true);
  assertStrictEquals(bs1.equals(bs1.toUint8Array()), true);
  assertStrictEquals(bs1.equals(Uint8Array.of(255, 0, 127, 1)), true);

  assertStrictEquals(bs1.equals(Uint8Array.of(255, 0, 123, 1)), false);
  assertStrictEquals(bs1.equals(Uint8Array.of(255, 0, 127, 1, 5)), false);
  assertStrictEquals(bs1.equals(Uint8Array.of(255, 0, 127)), false);
});

Deno.test("ByteSequence.prototype.equals(Array<number>)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));

  assertStrictEquals(bs0.equals([]), true);
  assertStrictEquals(bs1.equals(bs1.toArray()), true);
  assertStrictEquals(bs1.equals([255, 0, 127, 1]), true);

  assertStrictEquals(bs1.equals([255, 0, 127, 2]), false);
  assertStrictEquals(bs1.equals([255, 0, 127, 1, 2]), false);
  assertStrictEquals(bs1.equals([255, 0, 127]), false);
});

Deno.test("ByteSequence.prototype.equals(ArrayBuffer)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b = ByteSequence.fromArray([255, 0, 127, 1]);

  assertStrictEquals(bs0.equals(bs0.buffer), true);
  assertStrictEquals(bs1.equals(bs1b.buffer), true);
});

Deno.test("ByteSequence.prototype.startsWith(ByteSequence)", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs0b = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b = ByteSequence.fromArray([255, 0, 127, 1]);

  assertStrictEquals(bs0.startsWith(bs0), true);
  assertStrictEquals(bs0.startsWith(bs0b), true);

  assertStrictEquals(bs1.startsWith(bs1), true);
  assertStrictEquals(bs1.startsWith(bs1b), true);
  assertStrictEquals(bs1.startsWith(bs0), true);
  assertStrictEquals(bs0.startsWith(bs1), false);
});

Deno.test("ByteSequence.prototype.startsWith(Uint8Array)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));

  assertStrictEquals(bs0.startsWith(new Uint8Array(0)), true);
  assertStrictEquals(bs1.startsWith(bs1.toUint8Array()), true);
  assertStrictEquals(bs1.startsWith(Uint8Array.of(255, 0, 127, 1)), true);

  assertStrictEquals(bs1.startsWith(Uint8Array.of(255, 0, 123, 1)), false);
  assertStrictEquals(bs1.startsWith(Uint8Array.of(255, 0, 127, 1, 5)), false);
  assertStrictEquals(bs1.startsWith(Uint8Array.of(255, 0, 127)), true);

  assertStrictEquals(bs1.startsWith([255, 0, 127, 2]), false);
  assertStrictEquals(bs1.startsWith([255, 0, 127, 1, 2]), false);
  assertStrictEquals(bs1.startsWith([255, 0, 127]), true);
  assertStrictEquals(bs1.startsWith([255, 0]), true);
  assertStrictEquals(bs1.startsWith([255]), true);
  assertStrictEquals(bs1.startsWith([]), true);
});

Deno.test("ByteSequence.prototype.startsWith(Array<number>)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));

  assertStrictEquals(bs0.startsWith([]), true);
  assertStrictEquals(bs1.startsWith(bs1.toArray()), true);
  assertStrictEquals(bs1.startsWith([255, 0, 127, 1]), true);

  assertStrictEquals(bs1.startsWith([255, 0, 127, 2]), false);
  assertStrictEquals(bs1.startsWith([255, 0, 127, 1, 2]), false);
  assertStrictEquals(bs1.startsWith([255, 0, 127]), true);
});

Deno.test("ByteSequence.prototype.startsWith(Iterable<number>)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));

  // deno-lint-ignore require-yield
  const a = function* () {
    return;
  };
  assertStrictEquals(bs0.startsWith(a()), true);

  const b = function* () {
    yield 1;
    yield 2;
  };
  assertStrictEquals(bs1.startsWith(b()), false);

  const c = function* () {
    yield 255;
    yield 0;
  };
  assertStrictEquals(bs1.startsWith(c()), true);
});

Deno.test("ByteSequence.prototype.startsWith(ArrayBuffer)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b = ByteSequence.fromArray([255, 0, 127, 1]);

  assertStrictEquals(bs0.startsWith(bs0.buffer), true);
  assertStrictEquals(bs1.startsWith(bs1b.buffer), true);
  assertStrictEquals(bs1.startsWith(bs0.buffer), true);
});

Deno.test("ByteSequence.prototype.startsWith(*)", () => {
  const bs0 = ByteSequence.allocate(0);

  const bs1 = ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));

  assertThrows(
    () => {
      bs0.startsWith(null as unknown as Uint8Array);
    },
    TypeError,
    "otherBytes",
  );

  assertThrows(
    () => {
      bs0.startsWith(undefined as unknown as Uint8Array);
    },
    TypeError,
    "otherBytes",
  );

  assertThrows(
    () => {
      bs1.startsWith(["255"] as unknown as Uint8Array);
    },
    TypeError,
    "otherBytes",
  );
});

Deno.test("ByteSequence.prototype.segment(number)", () => {
  const bs1 = ByteSequence.generateRandom(1000);

  assertThrows(
    () => {
      bs1.segment(0);
    },
    TypeError,
    "segmentByteLength",
  );

  assertThrows(
    () => {
      bs1.segment(-1);
    },
    TypeError,
    "segmentByteLength",
  );

  assertThrows(
    () => {
      bs1.segment(undefined as unknown as number);
    },
    TypeError,
    "segmentByteLength",
  );

  const i1 = bs1.segment(100);
  let i = 0;
  for (const i1i of i1) {
    assertStrictEquals(i1i.byteLength, 100);
    assertStrictEquals(
      JSON.stringify(i1i.toArray()),
      JSON.stringify([...bs1.asUint8Array(i, 100)]),
    );
    i = i + 100;
  }
  assertStrictEquals(i, 1000);

  const i1b = bs1.segment(150);
  let ib = 0;
  for (const i1i of i1b) {
    if (ib < 900) {
      assertStrictEquals(i1i.byteLength, 150);
      assertStrictEquals(
        JSON.stringify(i1i.toArray()),
        JSON.stringify([...bs1.asUint8Array(ib, 150)]),
      );
    } else {
      assertStrictEquals(i1i.byteLength, 100);
      assertStrictEquals(
        JSON.stringify(i1i.toArray()),
        JSON.stringify([...bs1.asUint8Array(ib, 100)]),
      );
    }
    ib = ib + 150;
  }
  assertStrictEquals(ib, 1050);
});

Deno.test("ByteSequence.fromStream(ReadableStream)", async () => {
  //const fsfile = await Deno.open(testFilesDir + "128.txt");
  //const stream: ReadableStream<Uint8Array> = fsfile.readable;
  const res1 = new Response(new Uint8Array(128));
  const stream: ReadableStream<Uint8Array> = res1.body as ReadableStream<
    Uint8Array
  >;
  const r = await ByteSequence.fromStream(stream);
  assertStrictEquals(r.byteLength, 128);
});

Deno.test("ByteSequence.fromStream(ReadableStream, {total:number})", async () => {
  //const fsfile1 = await Deno.open(testFilesDir + "128.txt");
  //const stream: ReadableStream<Uint8Array> = fsfile1.readable;
  const res1 = new Response(new Uint8Array(128));
  const stream: ReadableStream<Uint8Array> = res1.body as ReadableStream<
    Uint8Array
  >;
  const r = await ByteSequence.fromStream(stream, { total: 128 });
  assertStrictEquals(r.byteLength, 128);

  //const fsfile2 = await Deno.open(testFilesDir + "128.txt");
  //const stream2: ReadableStream<Uint8Array> = fsfile2.readable;
  const res2 = new Response(new Uint8Array(128));
  const stream2: ReadableStream<Uint8Array> = res2.body as ReadableStream<
    Uint8Array
  >;
  const r2 = await ByteSequence.fromStream(stream2, { total: 64 });
  assertStrictEquals(r2.byteLength, 128);

  //const fsfile3 = await Deno.open(testFilesDir + "128.txt");
  //const stream3: ReadableStream<Uint8Array> = fsfile3.readable;
  const res3 = new Response(new Uint8Array(128));
  const stream3: ReadableStream<Uint8Array> = res3.body as ReadableStream<
    Uint8Array
  >;
  const r3 = await ByteSequence.fromStream(stream3, { total: 512 });
  assertStrictEquals(r3.byteLength, 128);
});

Deno.test("ByteSequence.fromStream(ReadableStream, { on*: function })", async () => {
  //const fsfile = await Deno.open(testFilesDir + "128.txt");
  //const stream: ReadableStream<Uint8Array> = fsfile.readable;
  const res1 = new Response(new Uint8Array(128));
  const stream: ReadableStream<Uint8Array> = res1.body as ReadableStream<
    Uint8Array
  >;
  const evtNames: string[] = [];
  const data: { total: number; loaded: number; lengthComputable?: boolean } = {
    total: -1,
    loaded: -1,
    lengthComputable: undefined,
  };
  const listener = (evt: ProgressEvent) => {
    evtNames.push(evt.type);
    data.total = evt.total;
    data.loaded = evt.loaded;
    data.lengthComputable = evt.lengthComputable;
  };
  const r = await ByteSequence.fromStream(stream, {
    //onloadstart: listener,
    //onloadend: listener,
    //onprogress: listener,
    //onabort: listener,
    //ontimeout: listener,
    //onerror: listener,
    //onload: listener,
  }, listener); //onProgressChange
  assertStrictEquals(r.byteLength, 128);
  assertStrictEquals(evtNames.filter((n) => n === "loadstart").length, 1);
  assertStrictEquals(evtNames.filter((n) => n === "loadend").length, 1);
  assertStrictEquals(
    evtNames.filter((n) => n === "progress").length >= 1,
    true,
  );
  //assertStrictEquals(evtNames.filter((n) => n === "abort").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "timeout").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "error").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "load").length, 1);
  assertStrictEquals(data.total, 0);
  assertStrictEquals(data.loaded, 128);
  assertStrictEquals(data.lengthComputable, false);
});

Deno.test("ByteSequence.fromStream(ReadableStream, { total:number, on*: function })", async () => {
  //const fsfile = await Deno.open(testFilesDir + "128.txt");
  //const stream: ReadableStream<Uint8Array> = fsfile.readable;
  const res1 = new Response(new Uint8Array(128));
  const stream: ReadableStream<Uint8Array> = res1.body as ReadableStream<
    Uint8Array
  >;
  const evtNames: string[] = [];
  const data: { total: number; loaded: number; lengthComputable?: boolean } = {
    total: -1,
    loaded: -1,
    lengthComputable: undefined,
  };
  const listener = (evt: ProgressEvent) => {
    evtNames.push(evt.type);
    data.total = evt.total;
    data.loaded = evt.loaded;
    data.lengthComputable = evt.lengthComputable;
  };
  const r = await ByteSequence.fromStream(stream, {
    total: 128,
    //onloadstart: listener,
    //onloadend: listener,
    //onprogress: listener,
    //onabort: listener,
    //ontimeout: listener,
    //onerror: listener,
    //onload: listener,
  }, listener); // onProgressChange
  assertStrictEquals(r.byteLength, 128);
  assertStrictEquals(evtNames.filter((n) => n === "loadstart").length, 1);
  assertStrictEquals(evtNames.filter((n) => n === "loadend").length, 1);
  assertStrictEquals(
    evtNames.filter((n) => n === "progress").length >= 1,
    true,
  );
  //assertStrictEquals(evtNames.filter((n) => n === "abort").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "timeout").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "error").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "load").length, 1);
  assertStrictEquals(data.total, 128);
  assertStrictEquals(data.loaded, 128);
  assertStrictEquals(data.lengthComputable, true);
});

Deno.test("ByteSequence.fromStream(ReadableStream, { total:number, signal: AbortSignal, on*: function })", async () => {
  const fsfile = await Deno.open(testFilesDir + "large.txt");
  try {
    fsfile.readable;
    //XXX shimでNot implemented
  } catch {
    return;
  }

  const stream: ReadableStream<Uint8Array> = fsfile.readable;
  const evtNames: string[] = [];
  const data: { total: number; loaded: number; lengthComputable?: boolean } = {
    total: -1,
    loaded: -1,
    lengthComputable: undefined,
  };
  const listener = (evt: ProgressEvent) => {
    evtNames.push(evt.type);
    data.total = evt.total;
    data.loaded = evt.loaded;
    data.lengthComputable = evt.lengthComputable;
  };
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 1);//build時は4くらい
  try {
    await ByteSequence.fromStream(stream, {
      total: 4096,
      signal: ac.signal,
      //onloadstart: listener,
      //onloadend: listener,
      //onprogress: listener,
      //onabort: listener,
      //ontimeout: listener,
      //onerror: listener,
      //onload: listener,
    }, listener); // onProgressChange
    throw new Error();
  } catch (e) {
    assertStrictEquals((e as Error)?.name, "AbortError");
  }
  assertStrictEquals(evtNames.filter((n) => n === "loadstart").length, 1);
  assertStrictEquals(evtNames.filter((n) => n === "loadend").length, 1);
  assertStrictEquals(
    evtNames.filter((n) => n === "progress").length >= 1,
    true,
  );
  //assertStrictEquals(evtNames.filter((n) => n === "abort").length, 1);
  //assertStrictEquals(evtNames.filter((n) => n === "timeout").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "error").length, 0);
  //assertStrictEquals(evtNames.filter((n) => n === "load").length, 0);
  assertStrictEquals(data.total, 4096);
  assertStrictEquals(data.loaded >= 1, true);
  assertStrictEquals(data.lengthComputable, true);
});

Deno.test("ByteSequence.prototype.toStream()", async () => {
  const res1 = new Response(new Uint8Array(128));
  const stream: ReadableStream<Uint8Array> = res1.body as ReadableStream<
    Uint8Array
  >;
  const r = await ByteSequence.fromStream(stream);
  const s2 = r.toStream();
  const r2 = await ByteSequence.fromStream(s2);
  assertStrictEquals(r.equals(r2), true);
});

Deno.test("ByteSequence.prototype.toStream()", async () => {
  const fsfile = await Deno.open(testFilesDir + "large.txt");
  try {
    fsfile.readable;
    //XXX shimでNot implemented
  } catch {
    return;
  }

  const stream: ReadableStream<Uint8Array> = fsfile.readable;
  const evtNames: string[] = [];
  const data: { total: number; loaded: number; lengthComputable?: boolean } = {
    total: -1,
    loaded: -1,
    lengthComputable: undefined,
  };
  const listener = (evt: ProgressEvent) => {
    evtNames.push(evt.type);
    data.total = evt.total;
    data.loaded = evt.loaded;
    data.lengthComputable = evt.lengthComputable;
  };

  const bs1 = await ByteSequence.fromStream(stream, {
    total: 4096,
    //onloadstart: listener,
    //onloadend: listener,
    //onprogress: listener,
    //onabort: listener,
    //ontimeout: listener,
    //onerror: listener,
    //onload: listener,
  }, listener); // onProgressChange

  const s2 = bs1.toStream();
  const bs2 = await ByteSequence.fromStream(s2);
  assertStrictEquals(bs1.equals(bs2), true);
});

Deno.test("ByteSequence.fromRequestOrResponse(Response)", async () => {
  const res1 = new Response();
  const b1 = await ByteSequence.fromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 0);
});

Deno.test("ByteSequence.fromRequestOrResponse(Response)", async () => {
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252));
  const b1 = await ByteSequence.fromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 4);

  // 読み取り済みのを再度読もうとした
  try {
    await ByteSequence.fromRequestOrResponse(res1);
    throw new Error();
  } catch (e) {
    assertStrictEquals(e?.name, "InvalidStateError");
    assertStrictEquals(e?.message, "bodyUsed:true");
  }
});

Deno.test("ByteSequence.fromRequestOrResponse(Response)", async () => {
  const headers1 = new Headers();
  headers1.append("content-type", "text/plain");
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252), {
    headers: headers1,
  });
  const b1 = await ByteSequence.fromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 4);
});

Deno.test("ByteSequence.fromRequestOrResponse(Response, {verifyHeaders:function})", async () => {
  const options1 = {
    verifyHeaders: (h: Headers): [boolean, string] | [boolean] => {
      const verified = h.get("Content-Type") === "text/plain";
      return [verified];
    },
  };
  const headers1 = new Headers();
  headers1.append("content-type", "text/plain");
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252), {
    headers: headers1,
  });
  const b1 = await ByteSequence.fromRequestOrResponse(res1, options1);
  assertStrictEquals(b1.byteLength, 4);
});

Deno.test("ByteSequence.fromRequestOrResponse(Response, {verifyHeaders:function})", async () => {
  const options1 = {
    verifyHeaders: (h: Headers): [boolean, string] | [boolean] => {
      const verified = h.get("Content-Type") === "text/csv";
      if (verified === true) {
        return [true];
      }
      return [verified, "err1"];
    },
  };
  const headers1 = new Headers();
  headers1.append("content-type", "text/plain");
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252), {
    headers: headers1,
  });
  try {
    await ByteSequence.fromRequestOrResponse(res1, options1);
    throw new Error();
  } catch (e) {
    assertStrictEquals(e?.name, "Error");
    assertStrictEquals(e?.message, "err1");
  }
});

Deno.test("ByteSequence.withMetadataFromRequestOrResponse(Response)", async () => {
  const res1 = new Response();
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 0);
  assertStrictEquals(meta1, undefined);
});

Deno.test("ByteSequence.withMetadataFromRequestOrResponse(Response)", async () => {
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252));
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 4);
  assertStrictEquals(meta1, undefined);

  // 読み取り済みのを再度読もうとした
  try {
    await ByteSequence.withMetadataFromRequestOrResponse(res1);
    throw new Error();
  } catch (e) {
    assertStrictEquals(e?.name, "InvalidStateError");
    assertStrictEquals(e?.message, "bodyUsed:true");
  }
});

Deno.test("ByteSequence.withMetadataFromRequestOrResponse(Response)", async () => {
  const headers1 = new Headers();
  headers1.append("content-type", "text/plain");
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252), {
    headers: headers1,
  });
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 4);
  assertStrictEquals(meta1?.type, "text/plain");
});

Deno.test("ByteSequence.withMetadataFromRequestOrResponse(Response, {verifyHeaders:function})", async () => {
  const options1 = {
    verifyHeaders: (h: Headers): [boolean, string] | [boolean] => {
      const verified = h.get("Content-Type") === "text/plain";
      return [verified];
    },
  };
  const headers1 = new Headers();
  headers1.append("content-type", "text/plain");
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252), {
    headers: headers1,
  });
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(res1, options1);
  assertStrictEquals(b1.byteLength, 4);
  assertStrictEquals(meta1?.type, "text/plain");
});

Deno.test("ByteSequence.withMetadataFromRequestOrResponse(Response, {verifyHeaders:function})", async () => {
  const options1 = {
    verifyHeaders: (h: Headers): [boolean, string] | [boolean] => {
      const verified = h.get("Content-Type") === "text/csv";
      if (verified === true) {
        return [true];
      }
      return [verified, "err1"];
    },
  };
  const headers1 = new Headers();
  headers1.append("content-type", "text/plain");
  const res1 = new Response(Uint8Array.of(255, 254, 253, 252), {
    headers: headers1,
  });
  try {
    await ByteSequence.withMetadataFromRequestOrResponse(res1, options1);
    throw new Error();
  } catch (e) {
    assertStrictEquals(e?.name, "Error");
    assertStrictEquals(e?.message, "err1");
  }
});

Deno.test("ByteSequence.prototype.toRequest(string, {})", async () => {
  const bb1 = ByteSequence.of(1, 2, 3);
  const req1 = bb1.toRequest("http://example.com/t1", { method: "post" });
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(req1);
  assertStrictEquals(b1.byteLength, 3);
  assertStrictEquals(meta1, undefined);

  assertThrows(
    () => {
      bb1.toRequest("http://example.com/t1", { method: "get" });
    },
    TypeError,
    "options.method",
  );

  assertThrows(
    () => {
      bb1.toRequest("", { method: "post" });
    },
    TypeError,
    "url",
  );
});

Deno.test("ByteSequence.prototype.toRequest(string, {})", async () => {
  const bb1 = ByteSequence.of(1, 2, 3);
  const req1 = bb1.toRequest("http://example.com/t1", {
    method: "post",
    headers: { "Content-Type": "image/png" },
  });
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(req1);
  assertStrictEquals(b1.byteLength, 3);
  assertStrictEquals(meta1?.type, "image/png");
});

Deno.test("ByteSequence.prototype.toResponse({})", async () => {
  const bb1 = ByteSequence.of(1, 2, 3);
  const res1 = bb1.toResponse({});
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 3);
  assertStrictEquals(meta1, undefined);
});

Deno.test("ByteSequence.prototype.toResponse({})", async () => {
  const bb1 = ByteSequence.of(1, 2, 3);
  const res1 = bb1.toResponse({ headers: { "content-type": "image/png" } });
  const { data: b1, options: meta1 } = await ByteSequence
    .withMetadataFromRequestOrResponse(res1);
  assertStrictEquals(b1.byteLength, 3);
  assertStrictEquals(meta1?.type, "image/png");
});
