import assert from "node:assert";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";
import iconv from "iconv-lite";
import { ByteSequence, MediaType } from "../../node/index.mjs";

describe("ByteSequence.prototype.byteLength", () => {
  it("byteLength", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.byteLength, 0);
    assert.strictEqual(bs1.byteLength, 1000);

  });

});

describe("ByteSequence.prototype.buffer", () => {
  it("buffer", () => {
    const a0 = new ArrayBuffer(0);
    const bs0 = ByteSequence.wrapArrayBuffer(a0);
    const bs0b = ByteSequence.wrapArrayBuffer(a0);
    const a1 = new ArrayBuffer(100);
    const bs1 = ByteSequence.fromArrayBuffer(a1);
    const bs1b = ByteSequence.fromArrayBuffer(a1);

    assert.strictEqual(bs0.buffer, a0);
    assert.strictEqual(bs0.buffer, bs0b.buffer);
    assert.notStrictEqual(bs1.buffer, a1);
    assert.notStrictEqual(bs1.buffer, bs1b.buffer);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.wrapArrayBuffer(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.buffer);
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 255);

  });

});

describe("ByteSequence.prototype.sha256Integrity", () => {
  it("sha256Integrity", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const b11 = await ByteSequence.fromBlob(b1);
    const i11a = await b11.sha256Integrity;
    assert.strictEqual(i11a, "sha256-IIm8EKKH9DeP2uG3Kn/lD4bbs5lgbsIi/L8hAswrj/w=");

  });

});

describe("ByteSequence.prototype.sha384Integrity", () => {
  it("sha384Integrity", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const b11 = await ByteSequence.fromBlob(b1);
    const i11b = await b11.sha384Integrity;
    assert.strictEqual(i11b, "sha384-0uhOVMndkWKKHtfDkQSsXCcT4r7Xr5Q2bcQ/uczTl2WivQ5094ZFIZZut1y32IsF");

  });

});

describe("ByteSequence.prototype.sha512Integrity", () => {
  it("sha512Integrity", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const b11 = await ByteSequence.fromBlob(b1);
    const i11c = await b11.sha512Integrity;
    assert.strictEqual(i11c, "sha512-lphfU9I644pv1b+t8yZp7b+kg+lFD+WcIeTqhWieCTRZJ4wWOxTAJxSk9rWrOmVb+TFJ2HfaKIBRFqQ0OOxyAw==");

  });

});

describe("ByteSequence.allocate", () => {
  it("allocate(number)", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1024 * 1024 * 1);

    assert.strictEqual(bs0.buffer.byteLength, 0);
    assert.strictEqual(bs1.buffer.byteLength, 1024 * 1024 * 1);

    assert.throws(() => {
      ByteSequence.allocate(-1);
    }, {
      name: "TypeError",
      message: "byteLength"
    });

    assert.throws(() => {
      ByteSequence.allocate(1.5);
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      ByteSequence.allocate(Number.NaN);
    }, {
      message: "byteLength"
    });

  });

});

describe("ByteSequence.wrapArrayBuffer", () => {
  it("wrapArrayBuffer(ArrayBuffer)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = ByteSequence.wrapArrayBuffer(bytes0.buffer);
    const bs1 = ByteSequence.wrapArrayBuffer(bytes1.buffer);

    assert.strictEqual(bs0 instanceof ByteSequence, true);
    assert.strictEqual(bs0.byteLength, 0);
    assert.strictEqual(bs1.byteLength, 5);
  });

  it("wrapArrayBuffer(*)", () => {
    assert.throws(() => {
      ByteSequence.wrapArrayBuffer(Uint8Array.of(255, 254, 1, 0, 100));
    }, {
      message: "buffer"
    });

    assert.throws(() => {
      ByteSequence.wrapArrayBuffer([]);
    }, {
      message: "buffer"
    });

  });

  it("コンストラクターに渡したArrayBufferへの操作は、自身に影響する", () => {
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs1 = ByteSequence.wrapArrayBuffer(bytes1.buffer);
    const a1 = bytes1.buffer;
    const nb1 = new Uint8Array(a1);
    nb1.set([1,2,3,4]);

    const bs1v = bs1.getView(Uint8Array);
    assert.strictEqual(bs1v[0], 1);
    assert.strictEqual(bs1v[1], 2);
    assert.strictEqual(bs1v[2], 3);
    assert.strictEqual(bs1v[3], 4);
    assert.strictEqual(bs1v[4], 100);
  });

});

describe("ByteSequence.fromArrayBuffer", () => {
  it("fromArrayBuffer(ArrayBuffer)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromArrayBuffer(a0.buffer);

    assert.strictEqual(bs0.byteLength, 10);
    const bs0a = bs0.getView(Uint8Array);
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new ArrayBuffer(0);
    const bs1 = ByteSequence.fromArrayBuffer(a1);

    assert.strictEqual(bs1.byteLength, 0);

  });

  it("fromArrayBuffer(*)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    assert.throws(() => {
      ByteSequence.fromArrayBuffer(a0);
    }, {
      message: "buffer"
    });

  });

});

describe("ByteSequence.prototype.toArrayBuffer", () => {
  it("toArrayBuffer()", () => {
    const a0 = new ArrayBuffer(0);
    const bs0 = ByteSequence.wrapArrayBuffer(a0);
    const bs0b = ByteSequence.wrapArrayBuffer(a0);
    const a1 = new ArrayBuffer(100);
    const bs1 = ByteSequence.fromArrayBuffer(a1);
    const bs1b = ByteSequence.fromArrayBuffer(a1);

    assert.notStrictEqual(bs0.toArrayBuffer(), a0);
    assert.notStrictEqual(bs0.toArrayBuffer(), bs0b.buffer);
    assert.notStrictEqual(bs1.toArrayBuffer(), a1);
    assert.notStrictEqual(bs1.toArrayBuffer(), bs1b.buffer);

  });

  it("返却値への操作は自身に影響しない", () => {
    const bs1 = ByteSequence.wrapArrayBuffer(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.toArrayBuffer());
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.notStrictEqual(new Uint8Array(bs1.toArrayBuffer())[0], 255);

  });

});

describe("ByteSequence.fromArrayBufferView", () => {
  it("fromArrayBufferView(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromArrayBufferView(a0);

    assert.strictEqual(bs0.byteLength, 10);
    const bs0a = bs0.getView(Uint8Array);
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    assert.strictEqual(bs1.byteLength, 0);

  });

  it("fromArrayBufferView(*)", () => {
    assert.throws(() => {
      ByteSequence.fromArrayBufferView([]);
    }, {
      message: "bufferView"
    });

  });

});

describe("ByteSequence.prototype.toUint8Array", () => {
  it("toUint8Array()", () => {
    const a1 = Uint8Array.of(3,2,1,0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toUint8Array();
    assert.strictEqual(c1 instanceof Uint8Array, true);
    assert.strictEqual([...c1].join(","), "3,2,1,0");
    assert.notStrictEqual(a1, c1);

    // 返却値への操作は自身に影響しない
    c1[0] = 255;
    assert.strictEqual([...a1].join(","), "3,2,1,0");
    assert.strictEqual([...c1].join(","), "255,2,1,0");

  });

});

describe("ByteSequence.prototype.toDataView", () => {
  it("toDataView()", () => {
    const a1 = Uint8Array.of(3,2,1,0,255,254,253,252);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toDataView();
    assert.strictEqual(c1 instanceof DataView, true);
    assert.strictEqual(c1.getUint8(0), 3);

  });

});

describe("ByteSequence.prototype.toArrayBufferView", () => {
  it("toArrayBufferView()", () => {
    const a1 = Uint8Array.of(3,2,1,0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toArrayBufferView();
    assert.strictEqual(c1 instanceof Uint8Array, true);
    assert.strictEqual([...c1].join(","), "3,2,1,0");

  });

  it("toArrayBufferView(Uint8Array)", () => {
    const a1 = Uint8Array.of(3,2,1,0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toArrayBufferView(Uint8Array);
    assert.strictEqual(c1 instanceof Uint8Array, true);
    assert.strictEqual([...c1].join(","), "3,2,1,0");

  });

  it("toArrayBufferView(BigInt64Array)", () => {
    const a1 = Uint8Array.of(3,2,1,0,255,254,253,252);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toArrayBufferView(BigInt64Array);
    assert.strictEqual(c1 instanceof BigInt64Array, true);
    assert.strictEqual([...c1].join(","), "-216736835873734141");

  });

  it("toArrayBufferView(*)", () => {
    const a1 = Uint8Array.of(3,2,1,0,255,254,253,252);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    assert.throws(() => {
      bs1.toArrayBufferView(Blob);
    }, {
      message: "ctor"
    });

  });

});

describe("ByteSequence.fromBufferSource", () => {
  it("fromBufferSource(ArrayBuffer)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromBufferSource(a0.buffer);

    assert.strictEqual(bs0.byteLength, 10);
    const bs0a = bs0.getView(Uint8Array);
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new ArrayBuffer(0);
    const bs1 = ByteSequence.fromBufferSource(a1);

    assert.strictEqual(bs1.byteLength, 0);

  });

  it("fromBufferSource(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromBufferSource(a0);

    assert.strictEqual(bs0.byteLength, 10);
    const bs0a = bs0.getView(Uint8Array);
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.fromBufferSource(a1);

    assert.strictEqual(bs1.byteLength, 0);

  });

});

describe("ByteSequence.fromArray", () => {
  it("fromArray(Array<number>)", () => {
    const a0 = [9,8,7,6,5,4,3,2,0,255];
    const bs0 = ByteSequence.fromArray(a0);

    assert.strictEqual(bs0.byteLength, 10);
    const bs0a = bs0.getView(Uint8Array);
    assert.strictEqual(bs0a[8], 0);
    assert.strictEqual(bs0a[9], 255);

    const a1 = [];
    const bs1 = ByteSequence.fromArray(a1);

    assert.strictEqual(bs1.byteLength, 0);

    const a2 = ["a"];
    assert.throws(() => {
      ByteSequence.fromArray(a2);
    }, {
      message: "byteArray"
    });

  });

});

describe("ByteSequence.prototype.toArray", () => {
  it("toArray()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.toArray().length, 0);
    assert.strictEqual(bs1.toArray().length, 1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.toArray()));

  });

});

describe("ByteSequence.generateRandom", () => {
  it("generateRandom(number)", () => {
    const bs0 = ByteSequence.generateRandom(0);
    const bs1 = ByteSequence.generateRandom(65536);

    assert.strictEqual(bs0.buffer.byteLength, 0);
    assert.strictEqual(bs1.buffer.byteLength, 65536);

    assert.throws(() => {
      ByteSequence.generateRandom(-1);
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(1.5);
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(Number.NaN);
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(65537);
    }, {
      message: "byteLength"
    });

  });

});

describe("ByteSequence.fromBinaryString", () => {
  it("fromBinaryString(string)", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    const bsa = bsbs.toArray();

    assert.strictEqual(bsa[0], 65);
    assert.strictEqual(bsa[1], 66);
    assert.strictEqual(bsa[2], 67);
    assert.strictEqual(bsa[3], 68);

    assert.strictEqual(ByteSequence.fromBinaryString("").byteLength, 0);

    assert.throws(() => {
      ByteSequence.fromBinaryString("あ");
    }, {
      message: "input"
    });

    assert.throws(() => {
      ByteSequence.fromBinaryString("\u0100");
    }, {
      message: "input"
    });

  });

});

describe("ByteSequence.prototype.toBinaryString", () => {
  it("toBinaryString()", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    assert.strictEqual(bsbs.toBinaryString(), binStr);

  });

});

describe("ByteSequence.parse", () => {
  it("parse(string)", () => {
    const bs0 = ByteSequence.parse("41A24344");
    assert.strictEqual(bs0.toString(), "41A24344");
    assert.strictEqual(ByteSequence.parse("").toString(), "");

    const bs1 = ByteSequence.parse("41a24344");
    assert.strictEqual(bs1.toString(), "41A24344");

    assert.throws(() => {
      ByteSequence.parse("あ");
    }, {
      message: "parse error: あ"
    });

    assert.throws(() => {
      ByteSequence.parse("GG");
    }, {
      message: "parse error: GG"
    });

  });

  it("parse(string, {radix:number})", () => {
    const bs0 = ByteSequence.parse("41424344", {radix:16});
    assert.strictEqual(bs0.toString(), "41424344");

    const bs1 = ByteSequence.parse("065066067068", {radix:10});
    assert.strictEqual(bs1.toString(), "41424344");

    const bs2 = ByteSequence.parse("101102103104", {radix:8});
    assert.strictEqual(bs2.toString(), "41424344");

    const bs3 = ByteSequence.parse("01000001010000100100001101000100", {radix:2});
    assert.strictEqual(bs3.toString(), "41424344");

  });

  it("parse(string, FormatOptions)", () => {
    const bs0 = ByteSequence.parse("0041004200430044", {radix:16, paddedLength:4, upperCase:true});
    assert.strictEqual(bs0.toString(), "41424344");

  });

});

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  it("format()", () => {
    assert.strictEqual(bs0.format(), "");
    assert.strictEqual(bs1.format(), "413C0A20A9");

  });

  it("format({radix:number})", () => {
    assert.strictEqual(bs1.format({radix:16}), "413C0A20A9");
    assert.strictEqual(bs1.format({radix:10}), "065060010032169");

  });

  it("format(FormatOptions)", () => {
    assert.strictEqual(bs1.format({radix:16,upperCase:false}), "413c0a20a9");
    assert.strictEqual(bs1.format({radix:16,paddedLength:3,upperCase:false}), "04103c00a0200a9");
    assert.strictEqual(bs1.format({radix:10,paddedLength:4}), "00650060001000320169");

  });

});

describe("ByteSequence.fromBase64Encoded", () => {
  it("fromBase64Encoded(string)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("");
    assert.strictEqual(bs0.byteLength, 0);

    const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=");
    assert.strictEqual(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

  });

  it("fromBase64Encoded(string, Object)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("", {});
    assert.strictEqual(bs0.byteLength, 0);

    const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=", {});
    assert.strictEqual(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs1b = ByteSequence.fromBase64Encoded(" A wIBAP/+/fw ", {});
    assert.strictEqual(bs1b.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs1c = ByteSequence.fromBase64Encoded("AwIBAP/+/fw", {padEnd:false});
    assert.strictEqual(bs1c.toArray().join(","), "3,2,1,0,255,254,253,252");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const bs2 = ByteSequence.fromBase64Encoded("AwIBAP_-_fw=", {table:rfc4648urlTable});
    assert.strictEqual(bs2.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2b = ByteSequence.fromBase64Encoded(" A wIBAP_-_fw ", {table:rfc4648urlTable});
    assert.strictEqual(bs2b.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2c = ByteSequence.fromBase64Encoded("AwIBAP_-_fw", {table:rfc4648urlTable,padEnd:false});
    assert.strictEqual(bs2c.toArray().join(","), "3,2,1,0,255,254,253,252");

  });

});

describe("ByteSequence.prototype.toBase64Encoded", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3,2,1,0,255,254,253,252]);

  it("toBase64Encoded()", () => {
    const s1 = bs0.toBase64Encoded();
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toBase64Encoded();
    assert.strictEqual(s11, "AwIBAP/+/fw=");

  });

  it("toBase64Encoded(Base64Options)", () => {
    const s1 = bs0.toBase64Encoded({});
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toBase64Encoded({});
    assert.strictEqual(s11, "AwIBAP/+/fw=");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const s11b = bs1.toBase64Encoded({table:rfc4648urlTable});
    assert.strictEqual(s11b, "AwIBAP_-_fw=");

    const s11c = bs1.toBase64Encoded({padEnd:false});
    assert.strictEqual(s11c, "AwIBAP/+/fw");

  });

});

describe("ByteSequence.fromPercentEncoded", () => {
  it("fromPercentEncoded(string)", () => {
    const bs1 = ByteSequence.fromPercentEncoded("");
    assert.strictEqual(bs1.byteLength, 0);

    const bs2 = ByteSequence.fromPercentEncoded("%03");
    assert.strictEqual(bs2.getView(Uint8Array)[0], 0x03);

  });

  it("fromPercentEncoded(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercentEncoded("", {});
    assert.strictEqual(bs0.byteLength, 0);

  });

});

describe("ByteSequence.prototype.toPercentEncoded", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3,2,1,0,255,254,253,252]);
  const bs3 = ByteSequence.fromArray([0x20,0x21,0x22,0x23]);

  it("toPercentEncoded()", () => {
    const s1 = bs0.toPercentEncoded();
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toPercentEncoded();
    assert.strictEqual(s11, "%03%02%01%00%FF%FE%FD%FC");

  });

  it("toPercentEncoded(PercentOptions)", () => {
    const s1 = bs0.toPercentEncoded({});
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toPercentEncoded({});
    assert.strictEqual(s11, "%03%02%01%00%FF%FE%FD%FC");

    const s3a = bs3.toPercentEncoded({spaceAsPlus:true});
    assert.strictEqual(s3a, "+%21%22%23");

    const s3b = bs3.toPercentEncoded({encodeSet:[]});
    assert.strictEqual(s3b, " !\"#");
  });

});

describe("ByteSequence.prototype.toSha256Digest", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha256Digest()", async () => {
    const s1 = await bs0.toSha256Digest();
    assert.strictEqual(s1.format(), "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855");

  });

});

describe("ByteSequence.prototype.toSha384Digest", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha384Digest()", async () => {
    const s1 = await bs0.toSha384Digest();
    assert.strictEqual(s1.format(), "38B060A751AC96384CD9327EB1B1E36A21FDB71114BE07434C0CC7BF63F6E1DA274EDEBFE76F65FBD51AD2F14898B95B");

  });

});

describe("ByteSequence.prototype.toSha512Digest", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha512Digest()", async () => {
    const s1 = await bs0.toSha512Digest();
    assert.strictEqual(s1.format(), "CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E");

  });

});

describe("ByteSequence.prototype.toDigest", () => {
  const bs0 = ByteSequence.allocate(0);

  const MD5 = {
    async compute(input) {
      const md5 = createHash("md5");
      md5.update(input);
      return md5.digest();
    }
  };

  it("toDigest({})", async () => {
    const s1 = await bs0.toDigest(MD5);
    assert.strictEqual(s1.format(), "D41D8CD98F00B204E9800998ECF8427E");

  });

});

describe("ByteSequence.prototype.toString", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  it("toString()", () => {
    assert.strictEqual(bs0.toString(), "");
    assert.strictEqual(bs1.toString(), "413C0A20A9");

  });

});

describe("ByteSequence.prototype.toJSON", () => {
  it("toJSON()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.toJSON().length, 0);
    assert.strictEqual(bs1.toJSON().length, 1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.toJSON()));

  });

});

describe("ByteSequence.utf8EncodeFrom", () => {
  it("utf8EncodeFrom(string)", () => {
    const bs1 = ByteSequence.utf8EncodeFrom("");
    assert.strictEqual(bs1.byteLength, 0);

    const bs2 = ByteSequence.utf8EncodeFrom("1あ3\u{A9}");
    assert.strictEqual(bs2.toArray().join(","), "49,227,129,130,51,194,169");

  });

});

describe("ByteSequence.prototype.utf8DecodeTo", () => {
  it("utf8DecodeTo()", () => {
    const bs1 = ByteSequence.fromArray([49,227,129,130,51,194,169]);
    assert.strictEqual(bs1.utf8DecodeTo(), "1あ3\u{A9}");

  });

});

describe("ByteSequence.textEncodeFrom", () => {
  it("textEncodeFrom(string)", () => {
    const bs1 = ByteSequence.textEncodeFrom("");
    assert.strictEqual(bs1.byteLength, 0);

    const bs2 = ByteSequence.textEncodeFrom("1あ3\u{A9}");
    assert.strictEqual(bs2.toArray().join(","), "49,227,129,130,51,194,169");

  });

  it("textEncodeFrom(string, Object)", () => {
    const eucJpEncoder = {
      encode(input = "") {
        return iconv.encode(input, "EUC-JP");// 末尾にバッファーがついてくる
        //return Uint8Array.from(iconv.encode(input, "EUC-JP"));
      }
    }

    const bs1 = ByteSequence.textEncodeFrom("", eucJpEncoder);
    assert.strictEqual(bs1.byteLength, 0);

    const bs2 = ByteSequence.textEncodeFrom("あいうえお", eucJpEncoder);
    assert.strictEqual(bs2.toArray().join(","), "164,162,164,164,164,166,164,168,164,170");

  });

});

describe("ByteSequence.prototype.textDecodeTo", () => {
  it("textDecodeTo()", () => {
    const bs1 = ByteSequence.fromArray([49,227,129,130,51,194,169]);
    assert.strictEqual(bs1.textDecodeTo(), "1あ3\u{A9}");

  });

  it("textDecodeTo(Object)", () => {
    const eucJpDecoder = new TextDecoder("euc-jp");

    const bs1 = ByteSequence.fromArray([164,162,164,164,164,166,164,168,164,170]);
    assert.strictEqual(bs1.textDecodeTo(eucJpDecoder), "あいうえお");

  });

});

describe("ByteSequence.fromBlob", () => {
  it("fromBlob(blob)", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11v = b11.getView(Uint8Array);
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);
    assert.strictEqual(b11.byteLength, 4);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b11)), `{"type":"text/plain"}`);

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const b21 = await ByteSequence.fromBlob(b2);
    const b21v = b21.getView(Uint8Array);
    assert.strictEqual(b21v[0], 255);
    assert.strictEqual(b21v[1], 0);
    assert.strictEqual(b21v[2], 1);
    assert.strictEqual(b21v[3], 127);
    assert.strictEqual(b21.byteLength, 4);
    assert.strictEqual(ByteSequence.MetadataStore.getBlobProperties(b21), undefined);

  });

});

describe("ByteSequence.prototype.toBlob", () => {
  it("toBlob()", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toBlob();
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");
    assert.strictEqual(b11b.type, "text/plain");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const b21 = await ByteSequence.fromBlob(b2);
    const b21b = b21.toBlob();
    const b21r = await b21b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b21r) ].join(","), "255,0,1,127");
    assert.strictEqual(b21b.type, "");

  });

  it("toBlob({})", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toBlob({type:"application/pdf"});
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");
    assert.strictEqual(b11b.type, "application/pdf");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const b21 = await ByteSequence.fromBlob(b2);
    const b21b = b21.toBlob({type:"text/html; charset=utf-8"});
    const b21r = await b21b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b21r) ].join(","), "255,0,1,127");
    assert.strictEqual(b21b.type, "text/html;charset=utf-8");

  });

});

/*
describe("ByteSequence.prototype.toFile", () => {
  it("toFile()", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile();
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");
    assert.strictEqual(b11b.type, "text/plain");
    assert.strictEqual(b11b.name, "test.txt");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);
    const b21 = await ByteSequence.fromBlob(b2);

    assert.throws(() => {
      b21.toFile();
    }, {
      message: "fileName"
    });

  });

  it("toFile(string)", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile("a.xml");
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");
    assert.strictEqual(b11b.type, "text/plain");
    assert.strictEqual(b11b.name, "a.xml");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);
    const b21 = await ByteSequence.fromBlob(b2);
    const b21b = b21.toFile("a.xml");
    const b21r = await b21b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b21r) ].join(","), "255,0,1,127");
    assert.strictEqual(b21b.type, "");
    assert.strictEqual(b21b.name, "a.xml");

  });

  it("toFile(string, string)", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile("a.xml", "application/xml");
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");
    assert.strictEqual(b11b.type, "application/xml");
    assert.strictEqual(b11b.name, "a.xml");

  });

  it("toFile(string, MediaType)", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile("a.xml", MediaType.fromString("application/xml"));
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");
    assert.strictEqual(b11b.type, "application/xml");
    assert.strictEqual(b11b.name, "a.xml");

  });

});
*/

describe("ByteSequence.fromDataURL", () => {
  it("fromDataURL(string)", async () => {

    const b0 = ByteSequence.fromDataURL("data:text/plain,");
    assert.strictEqual(b0.byteLength, 0);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b0)), `{"type":"text/plain"}`);

    const b0b = ByteSequence.fromDataURL("data:text/plain;base64,");
    assert.strictEqual(b0b.byteLength, 0);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b0b)), `{"type":"text/plain"}`);

    const b0c = ByteSequence.fromDataURL("data: ,");
    assert.strictEqual(b0c.byteLength, 0);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b0c)), `{"type":"text/plain;charset=US-ASCII"}`);

    const b0d = ByteSequence.fromDataURL("data: ; ,");
    assert.strictEqual(b0d.byteLength, 0);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b0d)), `{"type":"text/plain"}`);

    const b0e = ByteSequence.fromDataURL("data: ; x=y ,");
    assert.strictEqual(b0e.byteLength, 0);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b0e)), `{"type":"text/plain;x=y"}`);

    const b11 = ByteSequence.fromDataURL("data:text/plain,a1");
    const b11v = b11.getView(Uint8Array);
    assert.strictEqual(b11v[0], 97);
    assert.strictEqual(b11v[1], 49);
    assert.strictEqual(b11.byteLength, 2);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b11)), `{"type":"text/plain"}`);

    const b12 = ByteSequence.fromDataURL("data:application/octet-stream;base64,AwIBAP/+/fw=");
    const b12v = b12.getView(Uint8Array);
    assert.strictEqual(b12v[0], 3);
    assert.strictEqual(b12v[1], 2);
    assert.strictEqual(b12v[2], 1);
    assert.strictEqual(b12v[3], 0);
    assert.strictEqual(b12v[4], 255);
    assert.strictEqual(b12v[5], 254);
    assert.strictEqual(b12v[6], 253);
    assert.strictEqual(b12v[7], 252);
    assert.strictEqual(b12.byteLength, 8);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b12)), `{"type":"application/octet-stream"}`);

    const b21 = ByteSequence.fromDataURL("data:text/plain; p1=a,a1");
    const b21v = b21.getView(Uint8Array);
    assert.strictEqual(b21v[0], 97);
    assert.strictEqual(b21v[1], 49);
    assert.strictEqual(b21.byteLength, 2);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b21)), `{"type":"text/plain;p1=a"}`);

    const b22 = ByteSequence.fromDataURL("data:text/plain; p1=a;p2=\"b,c\",a1");
    const b22v = b22.getView(Uint8Array);
    assert.strictEqual(b22v[0], 99);
    assert.strictEqual(b22v[1], 34);
    assert.strictEqual(b22v[2], 44);
    assert.strictEqual(b22v[3], 97);
    assert.strictEqual(b22v[4], 49);
    assert.strictEqual(b22.byteLength, 5);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b22)), `{"type":"text/plain;p1=a;p2=b"}`);

    const b31 = ByteSequence.fromDataURL("data:text/plain,%FF%");
    const b31v = b31.getView(Uint8Array);
    assert.strictEqual(b31v[0], 255);
    assert.strictEqual(b31v[1], 0x25);
    assert.strictEqual(b31.byteLength, 2);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b31)), `{"type":"text/plain"}`);

    const b32 = ByteSequence.fromDataURL("data:text/plain,%fff");
    const b32v = b32.getView(Uint8Array);
    assert.strictEqual(b32v[0], 255);
    assert.strictEqual(b32v[1], 0x66);
    assert.strictEqual(b32.byteLength, 2);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b32)), `{"type":"text/plain"}`);

    const b33 = ByteSequence.fromDataURL("data:text/plain,a?a=2");
    const b33v = b33.getView(Uint8Array);
    assert.strictEqual(b33v[0], 0x61);
    assert.strictEqual(b33v[1], 0x3F);
    assert.strictEqual(b33v[2], 0x61);
    assert.strictEqual(b33v[3], 0x3D);
    assert.strictEqual(b33v[4], 0x32);
    assert.strictEqual(b33.byteLength, 5);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b33)), `{"type":"text/plain"}`);

    assert.throws(() => {
      ByteSequence.fromDataURL("data:text/plain");
    }, {
      message: "U+002C not found"
    });

    assert.throws(() => {
      ByteSequence.fromDataURL("data2:text/plain");
    }, {
      message: `URL scheme is not "data"`
    });

    assert.throws(() => {
      ByteSequence.fromDataURL("");
    }, {
      message: "dataUrl parse error"
    });

  });

  it("fromDataURL(URL)", async () => {
    const b11 = ByteSequence.fromDataURL(new URL("data:text/plain,a1"));
    const b11v = b11.getView(Uint8Array);
    assert.strictEqual(b11v[0], 97);
    assert.strictEqual(b11v[1], 49);
    assert.strictEqual(b11.byteLength, 2);
    assert.strictEqual(JSON.stringify(ByteSequence.MetadataStore.getBlobProperties(b11)), `{"type":"text/plain"}`);

  });

});

describe("ByteSequence.prototype.toDataURL", () => {
  it("toDataURL()", async () => {
    const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toDataURL();

    assert.strictEqual(b11b.toString(), "data:text/plain;base64,QQABfw==");

    const b2 = new Blob([ Uint8Array.of(65,0,1,127) ]);
    const b21 = await ByteSequence.fromBlob(b2);
    assert.throws(() => {
      b21.toDataURL();
    }, {
      message: "MIME type not resolved"
    });

  });

  it("toDataURL({})", async () => {
    const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
    const b11 = await ByteSequence.fromBlob(b1);
    const b11b = b11.toDataURL({type:"application/pdf"});

    assert.strictEqual(b11b.toString(), "data:application/pdf;base64,QQABfw==");

    const b2 = new Blob([ Uint8Array.of(65,0,1,127) ]);
    const b21 = await ByteSequence.fromBlob(b2);
    const b21b = b21.toDataURL({type:"application/pdf"});
    assert.strictEqual(b21b.toString(), "data:application/pdf;base64,QQABfw==");

  });

});

describe("ByteSequence.prototype.duplicate", () => {
  it("duplicate()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.duplicate().byteLength, 0);
    assert.notStrictEqual(bs0.duplicate().buffer, bs0.buffer);
    assert.strictEqual(bs0.duplicate().toString(), bs0.toString());

    assert.strictEqual(bs1.duplicate().byteLength, 1000);
    assert.notStrictEqual(bs1.duplicate().buffer, bs1.buffer);
    assert.strictEqual(bs1.duplicate().toString(), bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.duplicate().toArray()));

  });

});

describe("ByteSequence.prototype.subsequence", () => {
  const bs0 = ByteSequence.allocate(0);

  it("subsequence()", () => {

    assert.throws(() => {
      bs0.subsequence(undefined);
    }, {
      name: "TypeError",
      message: "start"
    });

  });

  it("subsequence(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    assert.strictEqual(bs0.subsequence(0).byteLength, 0);
    assert.notStrictEqual(bs0.subsequence(0).buffer, bs0.buffer);
    assert.strictEqual(bs0.subsequence(0).toString(), bs0.toString());

    assert.strictEqual(bs1.subsequence(0).byteLength, 1000);
    assert.strictEqual(bs1.subsequence(999).byteLength, 1);
    assert.strictEqual(bs1.subsequence(1000).byteLength, 0);
    assert.notStrictEqual(bs1.subsequence(0).buffer, bs1.buffer);
    assert.strictEqual(bs1.subsequence(0).toString(), bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.subsequence(0).toArray()));

    assert.throws(() => {
      bs1.subsequence(1001);
    }, {
      message: "start"
    });

  });

  it("subsequence(number, number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    assert.strictEqual(bs0.subsequence(0, 0).byteLength, 0);
    assert.strictEqual(bs0.subsequence(0, 1).byteLength, 0);
    assert.notStrictEqual(bs0.subsequence(0, 0).buffer, bs0.buffer);
    assert.strictEqual(bs0.subsequence(0, 0).toString(), bs0.toString());

    assert.strictEqual(bs1.subsequence(0, 1000).byteLength, 1000);
    assert.strictEqual(bs1.subsequence(999, 1000).byteLength, 1);
    assert.strictEqual(bs1.subsequence(1000, 1000).byteLength, 0);
    assert.strictEqual(bs1.subsequence(1000, 1001).byteLength, 0);
    assert.notStrictEqual(bs1.subsequence(0, 1000).buffer, bs1.buffer);
    assert.strictEqual(bs1.subsequence(0, 1000).toString(), bs1.toString());
    assert.strictEqual(bs1.subsequence(0, 1001).toString(), bs1.toString());

    assert.strictEqual(bs1.subsequence(100, 200).toString(), ByteSequence.fromArrayBufferView(bs1.getView(Uint8Array, 100, 100)).toString());

    assert.throws(() => {
      bs1.subsequence(1, -1);
    }, {
      message: "end"
    });

    assert.throws(() => {
      bs1.subsequence(2, 1);
    }, {
      message: "end"
    });

  });

});

describe("ByteSequence.prototype.getUint8View", () => {
  it("getUint8View()", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getUint8View();
    const v2 = bs1.getUint8View();
    assert.strictEqual(v1.byteLength, 1000);
    assert.strictEqual(v1 instanceof Uint8Array, true);
    assert.notStrictEqual(v1, v2);

    v1[0] = 255;
    assert.strictEqual(v2[0], 255);

  });

  it("getUint8View(number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getUint8View(500);
    assert.strictEqual(v1.byteLength, 500);

    v1[0] = 255;
    assert.strictEqual(bs1.getUint8View()[500], 255);

  });

  it("getUint8View(number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getUint8View(500, 1);
    assert.strictEqual(v1.byteLength, 1);

  });

});

describe("ByteSequence.prototype.getDataView", () => {
  it("getDataView()", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getDataView();
    const v2 = bs1.getDataView();
    assert.strictEqual(v1.byteLength, 1000);
    assert.strictEqual(v1 instanceof DataView, true);
    assert.notStrictEqual(v1, v2);

    v1.setUint8(0, 255);
    assert.strictEqual(v2.getUint8(0), 255);

  });

  it("getDataView(number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getDataView(500);
    assert.strictEqual(v1.byteLength, 500);

    v1.setUint8(0, 255);
    assert.strictEqual(bs1.getDataView().getUint8(500), 255);

  });

  it("getDataView(number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getDataView(500, 1);
    assert.strictEqual(v1.byteLength, 1);

  });

});

describe("ByteSequence.prototype.getView", () => {
  it("getView()", () => {
    const bs1 = ByteSequence.allocate(1000);
    assert.strictEqual(bs1.getView().byteLength, 1000);
  });

  it("getView(Uint8Array)", () => {
    const bs1 = ByteSequence.allocate(1000);
    assert.strictEqual(bs1.getView(Uint8Array).byteLength, 1000);
  });

  it("getView(DataView)", () => {
    const bs1 = ByteSequence.allocate(1000);
    assert.strictEqual(bs1.getView(DataView).byteLength, 1000);
  });

  it("getView(*)", () => {
    const bs1 = ByteSequence.allocate(1000);
    assert.throws(() => {
      bs1.getView(Blob);
    }, {
      message: "ctor"
    });
  });

  it("getView({}, number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    assert.strictEqual(bs1.getView(Uint8Array, 0).byteLength, 1000);
    assert.strictEqual(bs1.getView(Uint8Array, 500).byteLength, 500);
  });

  it("getView({}, number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs1.getView(Uint8Array, 0, 1).byteLength, 1);
    assert.strictEqual(bs1.getView(Uint8Array, 0, 1000).byteLength, 1000);
    assert.strictEqual(bs1.getView(Uint8Array, 1, 999).byteLength, 999);
    assert.strictEqual(bs1.getView(Uint8Array, 999, 1).byteLength, 1);
    assert.strictEqual(bs1.getView(Uint8Array, 1000, 0).byteLength, 0);
    assert.strictEqual(bs1.getView(Uint8Array, 0, 0).byteLength, 0);

    assert.throws(() => {
      bs1.getView(Uint8Array, -1, 1);
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, 1001, 1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, Number.NaN, 1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, 1.5, 1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, 0, Number.NaN)
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, 0, 1.5)
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, 0, 1001)
    }, {
      message: "byteLength"
    });

    assert.throws(() => {
      bs1.getView(Uint8Array, 999, 2)
    }, {
      message: "byteLength"
    });

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.fromArrayBufferView(b0);
    assert.notStrictEqual(bs0.getView(Uint8Array, 0, 0), b0);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.allocate(100);

    const x = bs1.getView(Uint8Array, 0, 100);
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 255);

    x[0] = 32;
    assert.strictEqual(x[0], 32);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 32);

  });

});

describe("ByteSequence.prototype.equals", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs0b = ByteSequence.allocate(0);

  const bs1 =  ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.fromArray([255, 0, 127, 1]);

  it("equals(ByteSequence)", () => {
    assert.strictEqual(bs0.equals(bs0), true);
    assert.strictEqual(bs0.equals(bs0b), true);

    assert.strictEqual(bs1.equals(bs1), true);
    assert.strictEqual(bs1.equals(bs1b), true);
    assert.strictEqual(bs1.equals(bs0), false);
    assert.strictEqual(bs0.equals(bs1), false);

  });

  it("equals(Uint8Array)", () => {
    assert.strictEqual(bs0.equals(new Uint8Array(0)), true);
    assert.strictEqual(bs1.equals(bs1.toUint8Array()), true);
    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 127, 1)), true);

    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 123, 1)), false);
    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 127, 1, 5)), false);
    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 127)), false);

  });

  it("equals(Array<number>)", () => {
    assert.strictEqual(bs0.equals([]), true);
    assert.strictEqual(bs1.equals(bs1.toArray()), true);
    assert.strictEqual(bs1.equals([255, 0, 127, 1]), true);

    assert.strictEqual(bs1.equals([255, 0, 127, 2]), false);
    assert.strictEqual(bs1.equals([255, 0, 127, 1, 2]), false);
    assert.strictEqual(bs1.equals([255, 0, 127]), false);

  });

  it("equals(ArrayBuffer)", () => {
    assert.strictEqual(bs0.equals(bs0.buffer), true);
    assert.strictEqual(bs1.equals(bs1b.buffer), true);

  });

});

describe("ByteSequence.prototype.startsWith", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs0b = ByteSequence.allocate(0);

  const bs1 =  ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.fromArray([255, 0, 127, 1]);

  it("startsWith(ByteSequence)", () => {
    assert.strictEqual(bs0.startsWith(bs0), true);
    assert.strictEqual(bs0.startsWith(bs0b), true);

    assert.strictEqual(bs1.startsWith(bs1), true);
    assert.strictEqual(bs1.startsWith(bs1b), true);
    assert.strictEqual(bs1.startsWith(bs0), true);
    assert.strictEqual(bs0.startsWith(bs1), false);

  });

  it("startsWith(Uint8Array)", () => {
    assert.strictEqual(bs0.startsWith(new Uint8Array(0)), true);
    assert.strictEqual(bs1.startsWith(bs1.toUint8Array()), true);
    assert.strictEqual(bs1.startsWith(Uint8Array.of(255, 0, 127, 1)), true);

    assert.strictEqual(bs1.startsWith(Uint8Array.of(255, 0, 123, 1)), false);
    assert.strictEqual(bs1.startsWith(Uint8Array.of(255, 0, 127, 1, 5)), false);
    assert.strictEqual(bs1.startsWith(Uint8Array.of(255, 0, 127)), true);

    assert.strictEqual(bs1.startsWith([255, 0, 127, 2]), false);
    assert.strictEqual(bs1.startsWith([255, 0, 127, 1, 2]), false);
    assert.strictEqual(bs1.startsWith([255, 0, 127]), true);
    assert.strictEqual(bs1.startsWith([255, 0]), true);
    assert.strictEqual(bs1.startsWith([255]), true);
    assert.strictEqual(bs1.startsWith([]), true);

  });

  it("startsWith(Array<number>)", () => {
    assert.strictEqual(bs0.startsWith([]), true);
    assert.strictEqual(bs1.startsWith(bs1.toArray()), true);
    assert.strictEqual(bs1.startsWith([255, 0, 127, 1]), true);

    assert.strictEqual(bs1.startsWith([255, 0, 127, 2]), false);
    assert.strictEqual(bs1.startsWith([255, 0, 127, 1, 2]), false);
    assert.strictEqual(bs1.startsWith([255, 0, 127]), true);

  });

  it("startsWith(ArrayBuffer)", () => {
    assert.strictEqual(bs0.startsWith(bs0.buffer), true);
    assert.strictEqual(bs1.startsWith(bs1b.buffer), true);
    assert.strictEqual(bs1.startsWith(bs0.buffer), true);

  });

  it("startsWith(*)", () => {
    assert.throws(() => {
      bs0.startsWith("");
    }, {
      message: "otherBytes"
    });

    assert.throws(() => {
      bs1.startsWith(["255"]);
    }, {
      message: "otherBytes"
    });

  });

});

describe("ByteSequence.prototype.segment", () => {
  it("segment(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    assert.throws(() => {
      bs1.segment(0);
    }, {
      message: "segmentByteLength"
    });

    assert.throws(() => {
      bs1.segment(-1);
    }, {
      message: "segmentByteLength"
    });

    assert.throws(() => {
      bs1.segment(undefined);
    }, {
      message: "segmentByteLength"
    });

    const i1 = bs1.segment(100);
    let i = 0;
    for (const i1i of i1) {
      assert.strictEqual(i1i.byteLength, 100);
      assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.getView(Uint8Array, i, 100)]));
      i = i + 100;
    }
    assert.strictEqual(i, 1000);

    const i1b = bs1.segment(150);
    let ib = 0;
    for (const i1i of i1b) {
      if (ib < 900) {
        assert.strictEqual(i1i.byteLength, 150);
        assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.getView(Uint8Array, ib, 150)]));
      }
      else {
        assert.strictEqual(i1i.byteLength, 100);
        assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.getView(Uint8Array, ib, 100)]));
      }
      ib = ib + 150;
    }
    assert.strictEqual(ib, 1050);

  });

});

describe("ByteSequence.createStreamReadingProgress", () => {
  it("createStreamReadingProgress(ReadableStream)", async () => {
    const stream = (Readable).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const p = ByteSequence.createStreamReadingProgress(stream);
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded, 0);
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    const r = await p.initiate();
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded, 128);
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    assert.strictEqual(r.byteLength, 128);

  });

  it("createStreamReadingProgress(ReadableStream, {total:number})", async () => {
    const stream = (Readable).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const p = ByteSequence.createStreamReadingProgress(stream, {total:128});
    assert.strictEqual(p.total, 128);
    assert.strictEqual(p.loaded, 0);
    assert.strictEqual(p.indeterminate, false);
    assert.strictEqual(p.percentage, 0);
    const r = await p.initiate();
    assert.strictEqual(p.total, 128);
    assert.strictEqual(p.loaded, 128);
    assert.strictEqual(p.indeterminate, false);
    assert.strictEqual(p.percentage, 100);
    assert.strictEqual(r.byteLength, 128);

  });

  it("createStreamReadingProgress(ReadableStream, {timeout:number})", async () => {
    let ti;
    const s = new ReadableStream({
      start(controller) {
        let c = 0;
        ti = setInterval(() => {
          if (c >= 10) {
            clearInterval(ti);
            controller.close();
            return;
          }
          c = c + 1;
          try {
            controller.enqueue(Uint8Array.of(1,2));
          }
          catch (ex) {
            clearInterval(ti);
            return;
          }

        }, 100);
      },
    });

    const p = ByteSequence.createStreamReadingProgress(s, {timeout:250});
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded, 0);
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    let r;
    try {
      r = await p.initiate();
      assert.strictEqual(true, false);
    }
    catch (exception) {
      assert.strictEqual((exception).name, "TimeoutError");
    }
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded, 4);
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    //assert.strictEqual(r.count, 4);

  });

  it("createStreamReadingProgress(ReadableStream, {timeout:number}) - 2", async () => {
    const stream = (Readable).toWeb(fs.createReadStream("./test/_data/4096.txt", { highWaterMark: 64 }));
    const p = ByteSequence.createStreamReadingProgress(stream, {timeout:4});
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded, 0);
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    let r;
    try {
      r = await p.initiate();
      assert.strictEqual(true, false);
    }
    catch (exception) {
      assert.strictEqual((exception).name, "TimeoutError");
    }
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded > 0, true);
    console.log(p.loaded)
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    //assert.strictEqual(r.count, 4);

  });

});

describe("ByteSequence.fromStream", () => {
  it("fromStream(ReadableStream)", async () => {
    const stream = (Readable).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r = await ByteSequence.fromStream(stream);
    assert.strictEqual(r.byteLength, 128);

  });

  it("fromStream(ReadableStream)", async () => {
    const stream = (Readable).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r = await ByteSequence.fromStream(stream, 128);
    assert.strictEqual(r.byteLength, 128);

    const stream2 = (Readable).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r2 = await ByteSequence.fromStream(stream2, 64);
    assert.strictEqual(r2.byteLength, 128);

    const stream3 = (Readable).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r3 = await ByteSequence.fromStream(stream3, 512);
    assert.strictEqual(r3.byteLength, 128);

  });

});

//TODO fromWebMessage
