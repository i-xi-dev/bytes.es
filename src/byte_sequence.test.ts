import assert from "node:assert";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";
import iconv from "iconv-lite";
import { ByteSequence } from "./byte_sequence";
import { uint8 } from "./index";

describe("ByteSequence.allocate", () => {
  it("allocate(number)", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1024 * 1024 * 1);

    assert.strictEqual(bs0.buffer.byteLength, 0);
    assert.strictEqual(bs1.buffer.byteLength, 1024 * 1024 * 1);

    assert.throws(() => {
      ByteSequence.allocate(-1);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.allocate(1.5);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.allocate(Number.NaN);
    }, {
      message: "byteCount"
    });

  });

});

describe("ByteSequence.prototype.count", () => {
  it("count", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.count, 0);
    assert.strictEqual(bs1.count, 1000);

  });

});

describe("ByteSequence.prototype.buffer", () => {
  it("buffer", () => {
    const a0 = new ArrayBuffer(0);
    const bs0 = ByteSequence.wrap(a0);
    const bs0b = ByteSequence.wrap(a0);
    const a1 = new ArrayBuffer(100);
    const b1 = new Uint8Array(a1);
    const bs1 = ByteSequence.from(b1);
    const bs1b = ByteSequence.from(b1);

    assert.strictEqual(bs0.buffer, a0);
    assert.strictEqual(bs0.buffer, bs0b.buffer);
    assert.notStrictEqual(bs1.buffer, a1);
    assert.notStrictEqual(bs1.buffer, bs1b.buffer);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.wrap(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.buffer);
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 255);

  });

});

describe("ByteSequence.prototype.view", () => {
  it("view", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.view.byteLength, 0);
    assert.strictEqual(bs1.view.byteLength, 1000);
    assert.strictEqual((bs1.view instanceof Uint8Array), true);

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    assert.notStrictEqual(bs0.view, b0);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.allocate(100);

    const x = bs1.view;
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 255);

    x[0] = 32;
    assert.strictEqual(x[0], 32);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 32);

  });

});

describe("ByteSequence.wrap", () => {
  it("wrap(ArrayBuffer)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = ByteSequence.wrap(bytes0.buffer);
    const bs1 = ByteSequence.wrap(bytes1.buffer);

    assert.strictEqual(bs0 instanceof ByteSequence, true);
    assert.strictEqual(bs0.count, 0);
    assert.strictEqual(bs1.count, 5);
  });

  it("wrap(Uint8Array)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = ByteSequence.wrap(bytes0);
    const bs1 = ByteSequence.wrap(bytes1);

    assert.strictEqual(bs0 instanceof ByteSequence, true);
    assert.strictEqual(bs0.count, 0);
    assert.strictEqual(bs1.count, 5);
  });

  it("wrap(*)", () => {
    assert.throws(() => {
      ByteSequence.wrap([] as unknown as Uint8Array);
    }, {
      message: "bytes"
    });

  });

  it("コンストラクターに渡したArrayBufferへの操作は、自身に影響する", () => {
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs1 = ByteSequence.wrap(bytes1.buffer);
    const a1 = bytes1.buffer;
    const nb1 = new Uint8Array(a1);
    nb1.set([1,2,3,4]);

    const bs1v = bs1.view;
    assert.strictEqual(bs1v[0], 1);
    assert.strictEqual(bs1v[1], 2);
    assert.strictEqual(bs1v[2], 3);
    assert.strictEqual(bs1v[3], 4);
    assert.strictEqual(bs1v[4], 100);
  });

});

describe("ByteSequence.from", () => {
  it("from(Array<number>)", () => {
    const a0: uint8[] = [9,8,7,6,5,4,3,2,0,255];
    const bs0 = ByteSequence.from(a0);

    assert.strictEqual(bs0.count, 10);
    const bs0a = bs0.view;
    assert.strictEqual(bs0a[8], 0);
    assert.strictEqual(bs0a[9], 255);

    const a1: uint8[] = [];
    const bs1 = ByteSequence.from(a1);

    assert.strictEqual(bs1.count, 0);

    const a2 = ["a"];
    assert.throws(() => {
      ByteSequence.from(a2 as unknown as uint8[]);
    }, {
      message: "bytes"
    });

  });

  it("from(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.from(a0);

    assert.strictEqual(bs0.count, 10);
    const bs0a = bs0.view;
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.from(a1);

    assert.strictEqual(bs1.count, 0);

  });

  it("from(ArrayBuffer)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.from(a0.buffer);

    assert.strictEqual(bs0.count, 10);
    const bs0a = bs0.view;
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new ArrayBuffer(0);
    const bs1 = ByteSequence.from(a1);

    assert.strictEqual(bs1.count, 0);

  });

  it("from(ByteSequence)", () => {
    const bs1 = ByteSequence.generateRandom(256);
    const bs1c = ByteSequence.from(bs1);

    assert.notStrictEqual(bs1, bs1c);
    assert.strictEqual(JSON.stringify(bs1.toArray()), JSON.stringify(bs1c.toArray()));

  });

  it("fromに渡したUint8Arrayへの操作は、自身に影響しない", () => {
    const a0 = Uint8Array.of(255,254,253,252,251);
    const bs0 = ByteSequence.from(a0);

    const bs0v = bs0.view;
    assert.strictEqual(bs0v[0], 255);
    assert.strictEqual(bs0v[1], 254);
    assert.strictEqual(bs0v[2], 253);
    assert.strictEqual(bs0v[3], 252);
    assert.strictEqual(bs0v[4], 251);

    a0[0] = 1;

    const bs0v2 = bs0.view;
    assert.strictEqual(bs0v2[0], 255);

  });

});

describe("ByteSequence.prototype.toUint8Array", () => {
  it("toUint8Array()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.toUint8Array().length, 0);
    assert.strictEqual(bs1.toUint8Array().length, 1000);

    const a2s = [1,2,3,4,5];
    const a2 = Uint8Array.from(a2s);
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2s), JSON.stringify([...bs2.toUint8Array()]));

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const a0 = Uint8Array.of(0,255);
    const bs0 = ByteSequence.from(a0);
    assert.notStrictEqual(bs0.toUint8Array(), a0);

  });

  it("返却値への操作は、自身に影響しない", () => {
    const bs0 = ByteSequence.of(0,255);
    const a0 = bs0.toUint8Array();

    assert.strictEqual(a0[1], 255);
    a0[1] = 1;
    assert.strictEqual(bs0.view[1], 255);

  });

});

describe("ByteSequence.prototype.toArray", () => {
  it("toArray()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.toArray().length, 0);
    assert.strictEqual(bs1.toArray().length, 1000);

    const a2: uint8[] = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.toArray()));

  });

});

describe("ByteSequence.of", () => {
  it("of(Array<number>)", () => {
    const bs0 = ByteSequence.of(1,2,3,4,5);
    assert.strictEqual(bs0.buffer.byteLength, 5);

    const a1: uint8[] = [1,2,3,4,5,6];
    const bs1 = ByteSequence.of(...a1);
    assert.strictEqual(bs1.buffer.byteLength, 6);

    assert.strictEqual(bs1.view[2], 3);

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
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(1.5);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(Number.NaN);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(65537);
    }, {
      message: "byteCount"
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

    assert.strictEqual(ByteSequence.fromBinaryString("").count, 0);

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
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

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
    assert.strictEqual(bs0.count, 0);

    const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=");
    assert.strictEqual(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

  });

  it("fromBase64Encoded(string, Object)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("", {});
    assert.strictEqual(bs0.count, 0);

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
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);

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
    assert.strictEqual(bs1.count, 0);

    const bs2 = ByteSequence.fromPercentEncoded("%03");
    assert.strictEqual(bs2.view[0], 0x03);

  });

  it("fromPercentEncoded(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercentEncoded("", {});
    assert.strictEqual(bs0.count, 0);

  });

});

describe("ByteSequence.prototype.toPercentEncoded", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);
  const bs3 = ByteSequence.of(0x20,0x21,0x22,0x23);

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

describe("ByteSequence.prototype.toString", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

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

    const a2: uint8[] = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.toJSON()));

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
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const md5 = createHash("md5");
      md5.update(input);
      return md5.digest();
    }
  };

  it("toDigest(string)", async () => {
    const s1 = await bs0.toDigest(MD5);
    assert.strictEqual(s1.format(), "D41D8CD98F00B204E9800998ECF8427E");

  });

});

describe("ByteSequence.prototype.subsequence", () => {
  const bs0 = ByteSequence.allocate(0);

  it("subsequence()", () => {

    assert.throws(() => {
      bs0.subsequence(undefined as unknown as number);
    }, {
      name: "TypeError",
      message: "start"
    });

  });

  it("subsequence(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    assert.strictEqual(bs0.subsequence(0).count, 0);
    assert.notStrictEqual(bs0.subsequence(0).buffer, bs0.buffer);
    assert.strictEqual(bs0.subsequence(0).toString(), bs0.toString());

    assert.strictEqual(bs1.subsequence(0).count, 1000);
    assert.strictEqual(bs1.subsequence(999).count, 1);
    assert.strictEqual(bs1.subsequence(1000).count, 0);
    assert.notStrictEqual(bs1.subsequence(0).buffer, bs1.buffer);
    assert.strictEqual(bs1.subsequence(0).toString(), bs1.toString());

    const a2: uint8[] = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.subsequence(0).toArray()));

    assert.throws(() => {
      bs1.subsequence(1001);
    }, {
      message: "start"
    });

  });

  it("subsequence(number, number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    assert.strictEqual(bs0.subsequence(0, 0).count, 0);
    assert.strictEqual(bs0.subsequence(0, 1).count, 0);
    assert.notStrictEqual(bs0.subsequence(0, 0).buffer, bs0.buffer);
    assert.strictEqual(bs0.subsequence(0, 0).toString(), bs0.toString());

    assert.strictEqual(bs1.subsequence(0, 1000).count, 1000);
    assert.strictEqual(bs1.subsequence(999, 1000).count, 1);
    assert.strictEqual(bs1.subsequence(1000, 1000).count, 0);
    assert.strictEqual(bs1.subsequence(1000, 1001).count, 0);
    assert.notStrictEqual(bs1.subsequence(0, 1000).buffer, bs1.buffer);
    assert.strictEqual(bs1.subsequence(0, 1000).toString(), bs1.toString());
    assert.strictEqual(bs1.subsequence(0, 1001).toString(), bs1.toString());

    assert.strictEqual(bs1.subsequence(100, 200).toString(), ByteSequence.from(bs1.viewScope(100, 100)).toString());

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

describe("ByteSequence.prototype.duplicate", () => {
  it("duplicate()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.duplicate().count, 0);
    assert.notStrictEqual(bs0.duplicate().buffer, bs0.buffer);
    assert.strictEqual(bs0.duplicate().toString(), bs0.toString());

    assert.strictEqual(bs1.duplicate().count, 1000);
    assert.notStrictEqual(bs1.duplicate().buffer, bs1.buffer);
    assert.strictEqual(bs1.duplicate().toString(), bs1.toString());

    const a2: uint8[] = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.duplicate().toArray()));

  });

});

describe("ByteSequence.prototype.viewScope", () => {
  it("viewScope(number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs1.viewScope(0, 1).byteLength, 1);
    assert.strictEqual(bs1.viewScope(0, 1000).byteLength, 1000);
    assert.strictEqual(bs1.viewScope(1, 999).byteLength, 999);
    assert.strictEqual(bs1.viewScope(999, 1).byteLength, 1);
    assert.strictEqual(bs1.viewScope(1000, 0).byteLength, 0);
    assert.strictEqual(bs1.viewScope(0, 0).byteLength, 0);

    assert.throws(() => {
      bs1.viewScope(-1, 1);
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.viewScope(1001, 1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.viewScope(Number.NaN, 1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.viewScope(1.5, 1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.viewScope(0, Number.NaN)
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      bs1.viewScope(0, 1.5)
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      bs1.viewScope(0, 1001)
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      bs1.viewScope(999, 2)
    }, {
      message: "byteCount"
    });

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    assert.notStrictEqual(bs0.viewScope(0, 0), b0);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.allocate(100);

    const x = bs1.viewScope(0, 100);
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

  const bs1 =  ByteSequence.from(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.of(255, 0, 127, 1);

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

  const bs1 =  ByteSequence.from(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.of(255, 0, 127, 1);

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
    assert.strictEqual(bs0.startsWith("" as unknown as Uint8Array), false);
    assert.strictEqual(bs1.startsWith(["255"] as unknown as Uint8Array), false);

  });

});

describe("ByteSequence.prototype.segments", () => {
  it("segments(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    assert.throws(() => {
      bs1.segments(0);
    }, {
      message: "segmentByteCount"
    });

    assert.throws(() => {
      bs1.segments(-1);
    }, {
      message: "segmentByteCount"
    });

    assert.throws(() => {
      bs1.segments(undefined as unknown as number);
    }, {
      message: "segmentByteCount"
    });

    const i1 = bs1.segments(100);
    let i = 0;
    for (const i1i of i1) {
      assert.strictEqual(i1i.count, 100);
      assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.viewScope(i, 100)]));
      i = i + 100;
    }
    assert.strictEqual(i, 1000);

    const i1b = bs1.segments(150);
    let ib = 0;
    for (const i1i of i1b) {
      if (ib < 900) {
        assert.strictEqual(i1i.count, 150);
        assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.viewScope(ib, 150)]));
      }
      else {
        assert.strictEqual(i1i.count, 100);
        assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.viewScope(ib, 100)]));
      }
      ib = ib + 150;
    }
    assert.strictEqual(ib, 1050);

  });

});

describe("ByteSequence.utf8EncodeFrom", () => {
  it("utf8EncodeFrom(string)", () => {
    const bs1 = ByteSequence.utf8EncodeFrom("");
    assert.strictEqual(bs1.count, 0);

    const bs2 = ByteSequence.utf8EncodeFrom("1あ3\u{A9}");
    assert.strictEqual(bs2.toArray().join(","), "49,227,129,130,51,194,169");

  });

});

describe("ByteSequence.prototype.utf8DecodeTo", () => {
  it("utf8DecodeTo()", () => {
    const bs1 = ByteSequence.of(49,227,129,130,51,194,169);
    assert.strictEqual(bs1.utf8DecodeTo(), "1あ3\u{A9}");

  });

});

describe("ByteSequence.textEncodeFrom", () => {
  it("textEncodeFrom(string)", () => {
    const bs1 = ByteSequence.textEncodeFrom("");
    assert.strictEqual(bs1.count, 0);

    const bs2 = ByteSequence.textEncodeFrom("1あ3\u{A9}");
    assert.strictEqual(bs2.toArray().join(","), "49,227,129,130,51,194,169");

  });

  it("textEncodeFrom(string, Object)", () => {
    const eucJpEncoder = {
      encode(input: string = ""): Uint8Array {
        return iconv.encode(input, "EUC-JP");// 末尾にバッファーがついてくる
        //return Uint8Array.from(iconv.encode(input, "EUC-JP"));
      }
    }

    const bs1 = ByteSequence.textEncodeFrom("", eucJpEncoder);
    assert.strictEqual(bs1.count, 0);

    const bs2 = ByteSequence.textEncodeFrom("あいうえお", eucJpEncoder);
    assert.strictEqual(bs2.toArray().join(","), "164,162,164,164,164,166,164,168,164,170");

  });

});

describe("ByteSequence.prototype.textDecodeTo", () => {
  it("textDecodeTo()", () => {
    const bs1 = ByteSequence.of(49,227,129,130,51,194,169);
    assert.strictEqual(bs1.textDecodeTo(), "1あ3\u{A9}");

  });

  it("textDecodeTo(Object)", () => {
    const eucJpDecoder = new TextDecoder("euc-jp");

    const bs1 = ByteSequence.of(164,162,164,164,164,166,164,168,164,170);
    assert.strictEqual(bs1.textDecodeTo(eucJpDecoder), "あいうえお");

  });

});

declare interface Temp1 {
  toWeb(s: fs.ReadStream): ReadableStream<Uint8Array>;
}

describe("ByteSequence.createStreamReadingProgress", () => {
  it("createStreamReadingProgress(ReadableStream)", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
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
    assert.strictEqual(r.count, 128);

  });

  it("createStreamReadingProgress(ReadableStream, {total:number})", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
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
    assert.strictEqual(r.count, 128);

  });

  it("createStreamReadingProgress(ReadableStream, {timeout:number})", async () => {
    let ti: NodeJS.Timeout;
    const s = new ReadableStream<Uint8Array>({
      start(controller: ReadableStreamDefaultController) {
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
      assert.strictEqual((exception as Error).name, "TimeoutError");
    }
    assert.strictEqual(p.total, undefined);
    assert.strictEqual(p.loaded, 4);
    assert.strictEqual(p.indeterminate, true);
    assert.strictEqual(p.percentage, 0);
    //assert.strictEqual(r.count, 4);

  });

  it("createStreamReadingProgress(ReadableStream, {timeout:number}) - 2", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/4096.txt", { highWaterMark: 64 }));
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
      assert.strictEqual((exception as Error).name, "TimeoutError");
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
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r = await ByteSequence.fromStream(stream);
    assert.strictEqual(r.count, 128);

  });

  it("fromStream(ReadableStream)", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r = await ByteSequence.fromStream(stream, 128);
    assert.strictEqual(r.count, 128);

    const stream2 = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r2 = await ByteSequence.fromStream(stream2, 64);
    assert.strictEqual(r2.count, 128);

    const stream3 = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r3 = await ByteSequence.fromStream(stream3, 512);
    assert.strictEqual(r3.count, 128);

  });

});

describe("ByteSequence.fromBlob", () => {
  it("fromBlob(blob)", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11v = b11.view;
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);
    assert.strictEqual(b11.count, 4);
    assert.strictEqual(b11.mediaType, "text/plain");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const b21 = await ByteSequence.fromBlob(b2);
    const b21v = b21.view;
    assert.strictEqual(b21v[0], 255);
    assert.strictEqual(b21v[1], 0);
    assert.strictEqual(b21v[2], 1);
    assert.strictEqual(b21v[3], 127);
    assert.strictEqual(b21.count, 4);
    assert.strictEqual(b21.mediaType, "");

  });

});
