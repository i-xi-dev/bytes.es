import { expect } from '@esm-bundle/chai';
import { ByteSequence } from "./index";

import { createHash } from "node:crypto";
import fs from "node:fs";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";
import iconv from "iconv-lite";

describe("ByteSequence.prototype.byteLength", () => {
  it("byteLength", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.byteLength).to.equal(0);
    expect(bs1.byteLength).to.equal(1000);

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

    expect(bs0.buffer).to.equal(a0);
    expect(bs0.buffer).to.equal(bs0b.buffer);
    expect(bs1.buffer).to.not.equal(a1);
    expect(bs1.buffer).to.not.equal(bs1b.buffer);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.wrapArrayBuffer(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.buffer);
    expect(x[0]).to.equal(0);

    x[0] = 255;
    expect(x[0]).to.equal(255);
    expect(new Uint8Array(bs1.buffer)[0]).to.equal(255);

  });

});

describe("ByteSequence.prototype.sha256Integrity", () => {
  it("sha256Integrity", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const i11a = await b11.sha256Integrity;
    expect(i11a).to.equal("sha256-IIm8EKKH9DeP2uG3Kn/lD4bbs5lgbsIi/L8hAswrj/w=");

  });

});

describe("ByteSequence.prototype.sha384Integrity", () => {
  it("sha384Integrity", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const i11b = await b11.sha384Integrity;
    expect(i11b).to.equal("sha384-0uhOVMndkWKKHtfDkQSsXCcT4r7Xr5Q2bcQ/uczTl2WivQ5094ZFIZZut1y32IsF");

  });

});

describe("ByteSequence.prototype.sha512Integrity", () => {
  it("sha512Integrity", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const i11c = await b11.sha512Integrity;
    expect(i11c).to.equal("sha512-lphfU9I644pv1b+t8yZp7b+kg+lFD+WcIeTqhWieCTRZJ4wWOxTAJxSk9rWrOmVb+TFJ2HfaKIBRFqQ0OOxyAw==");

  });

});

describe("ByteSequence.allocate", () => {
  it("allocate(number)", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1024 * 1024 * 1);

    expect(bs0.buffer.byteLength).to.equal(0);
    expect(bs1.buffer.byteLength).to.equal(1024 * 1024 * 1);

    const bs2 = ByteSequence.allocate(2);
    const bs2v = new Uint8Array(bs2.buffer);
    bs2v[0] = 255;
    expect(bs2.toUint8Array()[0]).to.equal(255);

    expect(() => {
      ByteSequence.allocate(-1);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.allocate(1.5);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.allocate(Number.NaN);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

  });

});

describe("ByteSequence.wrapArrayBuffer", () => {
  it("wrapArrayBuffer(ArrayBuffer)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = ByteSequence.wrapArrayBuffer(bytes0.buffer);
    const bs1 = ByteSequence.wrapArrayBuffer(bytes1.buffer);

    expect(bs0 instanceof ByteSequence).to.equal(true);
    expect(bs0.byteLength).to.equal(0);
    expect(bs1.byteLength).to.equal(5);
  });

  it("wrapArrayBuffer(*)", () => {
    expect(() => {
      ByteSequence.wrapArrayBuffer(Uint8Array.of(255, 254, 1, 0, 100));
    }).to.throw(TypeError, "buffer").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.wrapArrayBuffer([] as unknown as Uint8Array);
    }).to.throw(TypeError, "buffer").with.property("name", "TypeError");

  });

  it("コンストラクターに渡したArrayBufferへの操作は、自身に影響する", () => {
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs1 = ByteSequence.wrapArrayBuffer(bytes1.buffer);
    const a1 = bytes1.buffer;
    const nb1 = new Uint8Array(a1);
    nb1.set([1,2,3,4]);

    const bs1v = bs1.getView(Uint8Array);
    expect(bs1v[0]).to.equal(1);
    expect(bs1v[1]).to.equal(2);
    expect(bs1v[2]).to.equal(3);
    expect(bs1v[3]).to.equal(4);
    expect(bs1v[4]).to.equal(100);
  });

});

describe("ByteSequence.fromArrayBuffer", () => {
  it("fromArrayBuffer(ArrayBuffer)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromArrayBuffer(a0.buffer);

    expect(bs0.byteLength).to.equal(10);
    const bs0a = bs0.getView(Uint8Array);
    expect(bs0a[0]).to.equal(9);
    expect(bs0a[9]).to.equal(0);

    const a1 = new ArrayBuffer(0);
    const bs1 = ByteSequence.fromArrayBuffer(a1);

    expect(bs1.byteLength).to.equal(0);

  });

  it("fromArrayBuffer(*)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    expect(() => {
      ByteSequence.fromArrayBuffer(a0);
    }).to.throw(TypeError, "buffer").with.property("name", "TypeError");

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

    expect(bs0.toArrayBuffer()).to.not.equal(a0);
    expect(bs0.toArrayBuffer()).to.not.equal(bs0b.buffer);
    expect(bs1.toArrayBuffer()).to.not.equal(a1);
    expect(bs1.toArrayBuffer()).to.not.equal(bs1b.buffer);

  });

  it("返却値への操作は自身に影響しない", () => {
    const bs1 = ByteSequence.wrapArrayBuffer(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.toArrayBuffer());
    expect(x[0]).to.equal(0);

    x[0] = 255;
    expect(x[0]).to.equal(255);
    expect(new Uint8Array(bs1.toArrayBuffer())[0]).to.not.equal(255);

  });

});

describe("ByteSequence.fromArrayBufferView", () => {
  it("fromArrayBufferView(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromArrayBufferView(a0);

    expect(bs0.byteLength).to.equal(10);
    const bs0a = bs0.getView(Uint8Array);
    expect(bs0a[0]).to.equal(9);
    expect(bs0a[9]).to.equal(0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    expect(bs1.byteLength).to.equal(0);

  });

  it("fromArrayBufferView(*)", () => {
    expect(() => {
      ByteSequence.fromArrayBufferView([] as unknown as Uint8Array);
    }).to.throw(TypeError, "bufferView").with.property("name", "TypeError");

  });

});

describe("ByteSequence.prototype.toUint8Array", () => {
  it("toUint8Array()", () => {
    const a1 = Uint8Array.of(3,2,1,0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toUint8Array();
    expect(c1 instanceof Uint8Array).to.equal(true);
    expect([...c1].join(",")).to.equal("3,2,1,0");
    expect(a1).to.not.equal(c1);

    // 返却値への操作は自身に影響しない
    c1[0] = 255;
    expect([...a1].join(",")).to.equal("3,2,1,0");
    expect([...c1].join(",")).to.equal("255,2,1,0");

  });

});

describe("ByteSequence.prototype.toDataView", () => {
  it("toDataView()", () => {
    const a1 = Uint8Array.of(3,2,1,0,255,254,253,252);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toDataView();
    expect(c1 instanceof DataView).to.equal(true);
    expect(c1.getUint8(0)).to.equal(3);

  });

});

describe("ByteSequence.prototype.toArrayBufferView", () => {
  it("toArrayBufferView()", () => {
    const a1 = Uint8Array.of(3,2,1,0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toArrayBufferView<Uint8Array>();
    expect(c1 instanceof Uint8Array).to.equal(true);
    expect([...c1].join(",")).to.equal("3,2,1,0");

  });

  it("toArrayBufferView(Uint8Array)", () => {
    const a1 = Uint8Array.of(3,2,1,0);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toArrayBufferView(Uint8Array);
    expect(c1 instanceof Uint8Array).to.equal(true);
    expect([...c1].join(",")).to.equal("3,2,1,0");

  });

  it("toArrayBufferView(BigInt64Array)", () => {
    const a1 = Uint8Array.of(3,2,1,0,255,254,253,252);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    const c1 = bs1.toArrayBufferView(BigInt64Array);
    expect(c1 instanceof BigInt64Array).to.equal(true);
    expect([...c1].join(",")).to.equal("-216736835873734141");

  });

  it("toArrayBufferView(*)", () => {
    const a1 = Uint8Array.of(3,2,1,0,255,254,253,252);
    const bs1 = ByteSequence.fromArrayBufferView(a1);

    expect(() => {
      bs1.toArrayBufferView(Blob as unknown as Uint8ArrayConstructor);
    }).to.throw(TypeError, "ctor").with.property("name", "TypeError");

  });

});

describe("ByteSequence.fromBufferSource", () => {
  it("fromBufferSource(ArrayBuffer)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromBufferSource(a0.buffer);

    expect(bs0.byteLength).to.equal(10);
    const bs0a = bs0.getView(Uint8Array);
    expect(bs0a[0]).to.equal(9);
    expect(bs0a[9]).to.equal(0);

    const a1 = new ArrayBuffer(0);
    const bs1 = ByteSequence.fromBufferSource(a1);

    expect(bs1.byteLength).to.equal(0);

  });

  it("fromBufferSource(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.fromBufferSource(a0);

    expect(bs0.byteLength).to.equal(10);
    const bs0a = bs0.getView(Uint8Array);
    expect(bs0a[0]).to.equal(9);
    expect(bs0a[9]).to.equal(0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.fromBufferSource(a1);

    expect(bs1.byteLength).to.equal(0);

  });

});

describe("ByteSequence.fromArray", () => {
  it("fromArray(Array<number>)", () => {
    const a0 = [9,8,7,6,5,4,3,2,0,255];
    const bs0 = ByteSequence.fromArray(a0);

    expect(bs0.byteLength).to.equal(10);
    const bs0a = bs0.getView(Uint8Array);
    expect(bs0a[8]).to.equal(0);
    expect(bs0a[9]).to.equal(255);

    const a1: number[] = [];
    const bs1 = ByteSequence.fromArray(a1);

    expect(bs1.byteLength).to.equal(0);

    const a2 = ["a"];
    expect(() => {
      ByteSequence.fromArray(a2 as unknown as number[]);
    }).to.throw(TypeError, "byteArray").with.property("name", "TypeError");

  });

});

describe("ByteSequence.prototype.toArray", () => {
  it("toArray()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.toArray().length).to.equal(0);
    expect(bs1.toArray().length).to.equal(1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    expect(JSON.stringify(a2)).to.equal(JSON.stringify(bs2.toArray()));

  });

});

describe("ByteSequence.from", () => {
  it("from(ByteSequence)", () => {
    const bs0 = ByteSequence.allocate(100);
    const bs0c = ByteSequence.from(bs0);

    expect(bs0c.byteLength).to.equal(100);
    expect(bs0c).to.not.equal(bs0);

  });

  it("from(ArrayBuffer)", () => {
    const bs0 = ByteSequence.allocate(100);
    const bs0c = ByteSequence.from(bs0.buffer);

    expect(bs0c.byteLength).to.equal(100);
    expect(bs0c).to.not.equal(bs0);

  });

  it("from(ArrayBufferView)", () => {
    const bs0 = ByteSequence.allocate(100);
    const bs0c = ByteSequence.from(bs0.toUint8Array());

    expect(bs0c.byteLength).to.equal(100);
    expect(bs0c).to.not.equal(bs0);

  });

  it("from(number[])", () => {
    const bs0 = ByteSequence.allocate(100);
    const bs0c = ByteSequence.from(bs0.toArray());

    expect(bs0c.byteLength).to.equal(100);
    expect(bs0c).to.not.equal(bs0);

  });

  it("from(*)", () => {
    expect(() => {
      ByteSequence.from(["1"] as unknown as number[]);
    }).to.throw(TypeError, "sourceBytes").with.property("name", "TypeError");

  });

});

describe("ByteSequence.of", () => {
  it("of(...number[])", () => {
    const bs0 = ByteSequence.allocate(100);
    const bs0c = ByteSequence.of(...bs0.toArray());

    expect(bs0c.byteLength).to.equal(100);
    expect(bs0c).to.not.equal(bs0);

  });

});

describe("ByteSequence.generateRandom", () => {
  it("generateRandom(number)", () => {
    const bs0 = ByteSequence.generateRandom(0);
    const bs1 = ByteSequence.generateRandom(65536);

    expect(bs0.buffer.byteLength).to.equal(0);
    expect(bs1.buffer.byteLength).to.equal(65536);

    expect(() => {
      ByteSequence.generateRandom(-1);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.generateRandom(1.5);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.generateRandom(Number.NaN);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.generateRandom(65537);
    }).to.throw(RangeError, "byteLength").with.property("name", "RangeError");

  });

});

describe("ByteSequence.fromBinaryString", () => {
  it("fromBinaryString(string)", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    const bsa = bsbs.toArray();

    expect(bsa[0]).to.equal(65);
    expect(bsa[1]).to.equal(66);
    expect(bsa[2]).to.equal(67);
    expect(bsa[3]).to.equal(68);

    expect(ByteSequence.fromBinaryString("").byteLength).to.equal(0);

    expect(() => {
      ByteSequence.fromBinaryString("あ");
    }).to.throw(TypeError, "input").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.fromBinaryString("\u0100");
    }).to.throw(TypeError, "input").with.property("name", "TypeError");

  });

});

describe("ByteSequence.prototype.toBinaryString", () => {
  it("toBinaryString()", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    expect(bsbs.toBinaryString()).to.equal(binStr);

  });

});

describe("ByteSequence.parse", () => {
  it("parse(string)", () => {
    const bs0 = ByteSequence.parse("41A24344");
    expect(bs0.toString()).to.equal("41A24344");
    expect(ByteSequence.parse("").toString()).to.equal("");

    const bs1 = ByteSequence.parse("41a24344");
    expect(bs1.toString()).to.equal("41A24344");

    expect(() => {
      ByteSequence.parse("あ");
    }).to.throw(TypeError, "parse error: あ").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.parse("GG");
    }).to.throw(TypeError, "parse error: GG").with.property("name", "TypeError");

  });

  it("parse(string, {radix:number})", () => {
    const bs0 = ByteSequence.parse("41424344", {radix:16});
    expect(bs0.toString()).to.equal("41424344");

    const bs1 = ByteSequence.parse("065066067068", {radix:10});
    expect(bs1.toString()).to.equal("41424344");

    const bs2 = ByteSequence.parse("101102103104", {radix:8});
    expect(bs2.toString()).to.equal("41424344");

    const bs3 = ByteSequence.parse("01000001010000100100001101000100", {radix:2});
    expect(bs3.toString()).to.equal("41424344");

  });

  it("parse(string, FormatOptions)", () => {
    const bs0 = ByteSequence.parse("0041004200430044", {radix:16, paddedLength:4, lowerCase:true});
    expect(bs0.toString()).to.equal("41424344");

  });

});

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  it("format()", () => {
    expect(bs0.format()).to.equal("");
    expect(bs1.format()).to.equal("413C0A20A9");

  });

  it("format({radix:number})", () => {
    expect(bs1.format({radix:16})).to.equal("413C0A20A9");
    expect(bs1.format({radix:10})).to.equal("065060010032169");

  });

  it("format(FormatOptions)", () => {
    expect(bs1.format({radix:16,lowerCase:true})).to.equal("413c0a20a9");
    expect(bs1.format({radix:16,paddedLength:3,lowerCase:true})).to.equal("04103c00a0200a9");
    expect(bs1.format({radix:10,paddedLength:4})).to.equal("00650060001000320169");

  });

});

describe("ByteSequence.fromBase64Encoded", () => {
  it("fromBase64Encoded(string)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("");
    expect(bs0.byteLength).to.equal(0);

    const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=");
    expect(bs1.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

  });

  it("fromBase64Encoded(string, Object)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("", {});
    expect(bs0.byteLength).to.equal(0);

    const bs1 = ByteSequence.fromBase64Encoded("AwIBAP/+/fw=", {});
    expect(bs1.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

    const bs1b = ByteSequence.fromBase64Encoded(" A wIBAP/+/fw ", {});
    expect(bs1b.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

    const bs1c = ByteSequence.fromBase64Encoded("AwIBAP/+/fw", {noPadding:true});
    expect(bs1c.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const bs2 = ByteSequence.fromBase64Encoded("AwIBAP_-_fw=", {table:rfc4648urlTable});
    expect(bs2.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

    const bs2b = ByteSequence.fromBase64Encoded(" A wIBAP_-_fw ", {table:rfc4648urlTable});
    expect(bs2b.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

    const bs2c = ByteSequence.fromBase64Encoded("AwIBAP_-_fw", {table:rfc4648urlTable,noPadding:true});
    expect(bs2c.toArray().join(",")).to.equal("3,2,1,0,255,254,253,252");

  });

});

describe("ByteSequence.prototype.toBase64Encoded", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3,2,1,0,255,254,253,252]);

  it("toBase64Encoded()", () => {
    const s1 = bs0.toBase64Encoded();
    expect(s1.length).to.equal(0);

    const s11 = bs1.toBase64Encoded();
    expect(s11).to.equal("AwIBAP/+/fw=");

  });

  it("toBase64Encoded(Base64Options)", () => {
    const s1 = bs0.toBase64Encoded({});
    expect(s1.length).to.equal(0);

    const s11 = bs1.toBase64Encoded({});
    expect(s11).to.equal("AwIBAP/+/fw=");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const s11b = bs1.toBase64Encoded({table:rfc4648urlTable});
    expect(s11b).to.equal("AwIBAP_-_fw=");

    const s11c = bs1.toBase64Encoded({noPadding:true});
    expect(s11c).to.equal("AwIBAP/+/fw");

  });

});

describe("ByteSequence.fromPercentEncoded", () => {
  it("fromPercentEncoded(string)", () => {
    const bs1 = ByteSequence.fromPercentEncoded("");
    expect(bs1.byteLength).to.equal(0);

    const bs2 = ByteSequence.fromPercentEncoded("%03");
    expect(bs2.getView(Uint8Array)[0]).to.equal(0x03);

  });

  it("fromPercentEncoded(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercentEncoded("", {});
    expect(bs0.byteLength).to.equal(0);

  });

});

describe("ByteSequence.prototype.toPercentEncoded", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([3,2,1,0,255,254,253,252]);
  const bs3 = ByteSequence.fromArray([0x20,0x21,0x22,0x23]);

  it("toPercentEncoded()", () => {
    const s1 = bs0.toPercentEncoded();
    expect(s1.length).to.equal(0);

    const s11 = bs1.toPercentEncoded();
    expect(s11).to.equal("%03%02%01%00%FF%FE%FD%FC");

  });

  it("toPercentEncoded(PercentOptions)", () => {
    const s1 = bs0.toPercentEncoded({});
    expect(s1.length).to.equal(0);

    const s11 = bs1.toPercentEncoded({});
    expect(s11).to.equal("%03%02%01%00%FF%FE%FD%FC");

    const s3a = bs3.toPercentEncoded({spaceAsPlus:true});
    expect(s3a).to.equal("+%21%22%23");

    const s3b = bs3.toPercentEncoded({encodeSet:[]});
    expect(s3b).to.equal(" !\"#");
  });

});

describe("ByteSequence.prototype.toSha256Digest", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha256Digest()", async () => {
    const s1 = await bs0.toSha256Digest();
    expect(s1.format()).to.equal("E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855");

  });

});

describe("ByteSequence.prototype.toSha384Digest", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha384Digest()", async () => {
    const s1 = await bs0.toSha384Digest();
    expect(s1.format()).to.equal("38B060A751AC96384CD9327EB1B1E36A21FDB71114BE07434C0CC7BF63F6E1DA274EDEBFE76F65FBD51AD2F14898B95B");

  });

});

describe("ByteSequence.prototype.toSha512Digest", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha512Digest()", async () => {
    const s1 = await bs0.toSha512Digest();
    expect(s1.format()).to.equal("CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E");

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

  it("toDigest({})", async () => {
    const s1 = await bs0.toDigest(MD5);
    expect(s1.format()).to.equal("D41D8CD98F00B204E9800998ECF8427E");

  });

});

describe("ByteSequence.prototype.toString", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.fromArray([0x41, 0x3C, 0xA, 0x20, 0xA9]);

  it("toString()", () => {
    expect(bs0.toString()).to.equal("");
    expect(bs1.toString()).to.equal("413C0A20A9");

  });

});

describe("ByteSequence.prototype.toJSON", () => {
  it("toJSON()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.toJSON().length).to.equal(0);
    expect(bs1.toJSON().length).to.equal(1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    expect(JSON.stringify(a2)).to.equal(JSON.stringify(bs2.toJSON()));

  });

});

describe("ByteSequence.utf8EncodeFrom", () => {
  it("utf8EncodeFrom(string)", () => {
    const bs1 = ByteSequence.utf8EncodeFrom("");
    expect(bs1.byteLength).to.equal(0);

    const bs2 = ByteSequence.utf8EncodeFrom("1あ3\u{A9}");
    expect(bs2.toArray().join(",")).to.equal("49,227,129,130,51,194,169");

  });

});

describe("ByteSequence.prototype.utf8DecodeTo", () => {
  it("utf8DecodeTo()", () => {
    const bs1 = ByteSequence.fromArray([49,227,129,130,51,194,169]);
    expect(bs1.utf8DecodeTo()).to.equal("1あ3\u{A9}");

  });

});

describe("ByteSequence.textEncodeFrom", () => {
  it("textEncodeFrom(string)", () => {
    const bs1 = ByteSequence.textEncodeFrom("");
    expect(bs1.byteLength).to.equal(0);

    const bs2 = ByteSequence.textEncodeFrom("1あ3\u{A9}");
    expect(bs2.toArray().join(",")).to.equal("49,227,129,130,51,194,169");

  });

  it("textEncodeFrom(string, Object)", () => {
    const eucJpEncoder = {
      encode(input: string = ""): Uint8Array {
        return iconv.encode(input, "EUC-JP");// 末尾にバッファーがついてくる
        //return Uint8Array.from(iconv.encode(input, "EUC-JP"));
      }
    }

    const bs1 = ByteSequence.textEncodeFrom("", eucJpEncoder);
    expect(bs1.byteLength).to.equal(0);

    const bs2 = ByteSequence.textEncodeFrom("あいうえお", eucJpEncoder);
    expect(bs2.toArray().join(",")).to.equal("164,162,164,164,164,166,164,168,164,170");

  });

});

describe("ByteSequence.prototype.textDecodeTo", () => {
  it("textDecodeTo()", () => {
    const bs1 = ByteSequence.fromArray([49,227,129,130,51,194,169]);
    expect(bs1.textDecodeTo()).to.equal("1あ3\u{A9}");

  });

  it("textDecodeTo(Object)", () => {
    const eucJpDecoder = new TextDecoder("euc-jp");

    const bs1 = ByteSequence.fromArray([164,162,164,164,164,166,164,168,164,170]);
    expect(bs1.textDecodeTo(eucJpDecoder)).to.equal("あいうえお");

  });

});

describe("ByteSequence.fromBlob", () => {
  it("fromBlob(blob)", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const {data:b11, options:meta11} = await ByteSequence.fromBlob(b1);
    const b11v = b11.getView(Uint8Array);
    expect(b11v[0]).to.equal(255);
    expect(b11v[1]).to.equal(0);
    expect(b11v[2]).to.equal(1);
    expect(b11v[3]).to.equal(127);
    expect(b11.byteLength).to.equal(4);
    expect(JSON.stringify(meta11)).to.equal(`{"type":"text/plain"}`);

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const {data:b21, options:meta21} = await ByteSequence.fromBlob(b2);
    const b21v = b21.getView(Uint8Array);
    expect(b21v[0]).to.equal(255);
    expect(b21v[1]).to.equal(0);
    expect(b21v[2]).to.equal(1);
    expect(b21v[3]).to.equal(127);
    expect(b21.byteLength).to.equal(4);
    expect(meta21).to.equal(undefined);

  });

});

describe("ByteSequence.prototype.toBlob", () => {
  it("toBlob()", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const {data:b11, options:meta11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toBlob(meta11);
    const b11r = await b11b.arrayBuffer();
    expect([ ...new Uint8Array(b11r) ].join(",")).to.equal("255,0,1,127");
    expect(b11b.type).to.equal("text/plain");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const {data:b21} = await ByteSequence.fromBlob(b2);
    const b21b = b21.toBlob();
    const b21r = await b21b.arrayBuffer();
    expect([ ...new Uint8Array(b21r) ].join(",")).to.equal("255,0,1,127");
    expect(b21b.type).to.equal("");

  });

  it("toBlob({})", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toBlob({type:"application/pdf"});
    const b11r = await b11b.arrayBuffer();
    expect([ ...new Uint8Array(b11r) ].join(",")).to.equal("255,0,1,127");
    expect(b11b.type).to.equal("application/pdf");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);

    const {data:b21} = await ByteSequence.fromBlob(b2);
    const b21b = b21.toBlob({type:"text/html; charset=utf-8"});
    const b21r = await b21b.arrayBuffer();
    expect([ ...new Uint8Array(b21r) ].join(",")).to.equal("255,0,1,127");
    expect(b21b.type).to.equal("text/html;charset=utf-8");

  });

});

describe("ByteSequence.prototype.toFile", () => {
  it("toFile(string)", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile("test.txt");
    const b11r = await b11b.arrayBuffer();
    expect([ ...new Uint8Array(b11r) ].join(",")).to.equal("255,0,1,127");
    expect(b11b.type).to.equal("text/plain");
    expect(b11b.name).to.equal("test.txt");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);
    const {data:b21} = await ByteSequence.fromBlob(b2);

    expect(() => {
      b21.toFile(undefined as unknown as string);
    }).to.throw(TypeError, "fileName").with.property("name", "TypeError");

  });

  it("toFile(string)", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile("a.xml");
    const b11r = await b11b.arrayBuffer();
    expect([ ...new Uint8Array(b11r) ].join(",")).to.equal("255,0,1,127");
    expect(b11b.type).to.equal("text/plain");
    expect(b11b.name).to.equal("a.xml");

    const b2 = new Blob([ Uint8Array.of(255,0,1,127) ]);
    const {data:b21} = await ByteSequence.fromBlob(b2);
    const b21b = b21.toFile("a.xml");
    const b21r = await b21b.arrayBuffer();
    expect([ ...new Uint8Array(b21r) ].join(",")).to.equal("255,0,1,127");
    expect(b21b.type).to.equal("");
    expect(b21b.name).to.equal("a.xml");

  });

  it("toFile(string, string)", async () => {
    const b1 = new File([ Uint8Array.of(255,0,1,127) ], "test.txt", { type: "text/plain" });

    const {data:b11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toFile("a.xml", {type:"application/xml",lastModified:Date.parse("2021-02-03T04:05:06Z")});
    const b11r = await b11b.arrayBuffer();
    expect([ ...new Uint8Array(b11r) ].join(",")).to.equal("255,0,1,127");
    expect(b11b.type).to.equal("application/xml");
    expect(b11b.name).to.equal("a.xml");
    expect(b11b.lastModified).to.equal(Date.parse("2021-02-03T04:05:06Z"));

  });

});

describe("ByteSequence.fromDataURL", () => {
  it("fromDataURL(string)", async () => {

    const {data:b0, options:meta0} = ByteSequence.fromDataURL("data:text/plain,");
    expect(b0.byteLength).to.equal(0);
    expect(JSON.stringify(meta0)).to.equal( `{"type":"text/plain"}`);

    const {data:b0b, options:meta0b} = ByteSequence.fromDataURL("data:text/plain;base64,");
    expect(b0b.byteLength).to.equal(0);
    expect(JSON.stringify(meta0b)).to.equal(`{"type":"text/plain"}`);

    const {data:b0c, options:meta0c} = ByteSequence.fromDataURL("data: ,");
    expect(b0c.byteLength).to.equal(0);
    expect(JSON.stringify(meta0c)).to.equal(`{"type":"text/plain;charset=US-ASCII"}`);

    const {data:b0d, options:meta0d} = ByteSequence.fromDataURL("data: ; ,");
    expect(b0d.byteLength).to.equal(0);
    expect(JSON.stringify(meta0d)).to.equal(`{"type":"text/plain"}`);

    const {data:b0e, options:meta0e} = ByteSequence.fromDataURL("data: ; x=y ,");
    expect(b0e.byteLength).to.equal(0);
    expect(JSON.stringify(meta0e)).to.equal(`{"type":"text/plain;x=y"}`);

    const {data:b11, options:meta11} = ByteSequence.fromDataURL("data:text/plain,a1");
    const b11v = b11.getView(Uint8Array);
    expect(b11v[0]).to.equal(97);
    expect(b11v[1]).to.equal(49);
    expect(b11.byteLength).to.equal(2);
    expect(JSON.stringify(meta11)).to.equal(`{"type":"text/plain"}`);

    const {data:b12, options:meta12} = ByteSequence.fromDataURL("data:application/octet-stream;base64,AwIBAP/+/fw=");
    const b12v = b12.getView(Uint8Array);
    expect(b12v[0]).to.equal(3);
    expect(b12v[1]).to.equal(2);
    expect(b12v[2]).to.equal(1);
    expect(b12v[3]).to.equal(0);
    expect(b12v[4]).to.equal(255);
    expect(b12v[5]).to.equal(254);
    expect(b12v[6]).to.equal(253);
    expect(b12v[7]).to.equal(252);
    expect(b12.byteLength).to.equal(8);
    expect(JSON.stringify(meta12)).to.equal(`{"type":"application/octet-stream"}`);

    const {data:b21, options:meta21} = ByteSequence.fromDataURL("data:text/plain; p1=a,a1");
    const b21v = b21.getView(Uint8Array);
    expect(b21v[0]).to.equal(97);
    expect(b21v[1]).to.equal(49);
    expect(b21.byteLength).to.equal(2);
    expect(JSON.stringify(meta21)).to.equal(`{"type":"text/plain;p1=a"}`);

    const {data:b22, options:meta22} = ByteSequence.fromDataURL("data:text/plain; p1=a;p2=\"b,c\",a1");
    const b22v = b22.getView(Uint8Array);
    expect(b22v[0]).to.equal(99);
    expect(b22v[1]).to.equal(34);
    expect(b22v[2]).to.equal(44);
    expect(b22v[3]).to.equal(97);
    expect(b22v[4]).to.equal(49);
    expect(b22.byteLength).to.equal(5);
    expect(JSON.stringify(meta22)).to.equal(`{"type":"text/plain;p1=a;p2=b"}`);

    const {data:b31, options:meta31} = ByteSequence.fromDataURL("data:text/plain,%FF%");
    const b31v = b31.getView(Uint8Array);
    expect(b31v[0]).to.equal(255);
    expect(b31v[1]).to.equal(0x25);
    expect(b31.byteLength).to.equal(2);
    expect(JSON.stringify(meta31)).to.equal(`{"type":"text/plain"}`);

    const {data:b32, options:meta32} = ByteSequence.fromDataURL("data:text/plain,%fff");
    const b32v = b32.getView(Uint8Array);
    expect(b32v[0]).to.equal(255);
    expect(b32v[1]).to.equal(0x66);
    expect(b32.byteLength).to.equal(2);
    expect(JSON.stringify(meta32)).to.equal(`{"type":"text/plain"}`);

    const {data:b33, options:meta33} = ByteSequence.fromDataURL("data:text/plain,a?a=2");
    const b33v = b33.getView(Uint8Array);
    expect(b33v[0]).to.equal(0x61);
    expect(b33v[1]).to.equal(0x3F);
    expect(b33v[2]).to.equal(0x61);
    expect(b33v[3]).to.equal(0x3D);
    expect(b33v[4]).to.equal(0x32);
    expect(b33.byteLength).to.equal(5);
    expect(JSON.stringify(meta33)).to.equal(`{"type":"text/plain"}`);

    expect(() => {
      ByteSequence.fromDataURL("data:text/plain");
    }).to.throw(TypeError, "U+002C not found").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.fromDataURL("data2:text/plain");
    }).to.throw(TypeError, `URL scheme is not "data"`).with.property("name", "TypeError");

    expect(() => {
      ByteSequence.fromDataURL("");
    }).to.throw(TypeError, "dataUrl parse error").with.property("name", "TypeError");

  });

  it("fromDataURL(URL)", async () => {
    const {data:b11, options:meta11} = ByteSequence.fromDataURL(new URL("data:text/plain,a1"));
    const b11v = b11.getView(Uint8Array);
    expect(b11v[0]).to.equal(97);
    expect(b11v[1]).to.equal(49);
    expect(b11.byteLength).to.equal(2);
    expect(JSON.stringify(meta11)).to.equal(`{"type":"text/plain"}`);

  });

});

describe("ByteSequence.prototype.toDataURL", () => {
  it("toDataURL()", async () => {
    const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
    const {data:b11, options:meta11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toDataURL(meta11);

    expect(b11b.toString()).to.equal("data:text/plain;base64,QQABfw==");

    const b2 = new Blob([ Uint8Array.of(65,0,1,127) ]);
    const {data:b21} = await ByteSequence.fromBlob(b2);
    expect(() => {
      b21.toDataURL();
    }).to.throw(TypeError, "MIME type not resolved").with.property("name", "TypeError");

  });

  it("toDataURL({})", async () => {
    const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
    const {data:b11} = await ByteSequence.fromBlob(b1);
    const b11b = b11.toDataURL({type:"application/pdf"});

    expect(b11b.toString()).to.equal("data:application/pdf;base64,QQABfw==");

    const b2 = new Blob([ Uint8Array.of(65,0,1,127) ]);
    const {data:b21} = await ByteSequence.fromBlob(b2);
    const b21b = b21.toDataURL({type:"application/pdf"});
    expect(b21b.toString()).to.equal("data:application/pdf;base64,QQABfw==");

  });

});

describe("ByteSequence.prototype.duplicate", () => {
  it("duplicate()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.duplicate().byteLength).to.equal(0);
    expect(bs0.duplicate().buffer).to.not.equal(bs0.buffer);
    expect(bs0.duplicate().toString()).to.equal(bs0.toString());

    expect(bs1.duplicate().byteLength).to.equal(1000);
    expect(bs1.duplicate().buffer).to.not.equal(bs1.buffer);
    expect(bs1.duplicate().toString()).to.equal(bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    expect(JSON.stringify(a2)).to.equal(JSON.stringify(bs2.duplicate().toArray()));

  });

});

describe("ByteSequence.prototype.subsequence", () => {
  const bs0 = ByteSequence.allocate(0);

  it("subsequence()", () => {

    expect(() => {
      bs0.subsequence(undefined as unknown as number);
    }).to.throw(TypeError, "start").with.property("name", "TypeError");

  });

  it("subsequence(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    expect(bs0.subsequence(0).byteLength).to.equal(0);
    expect(bs0.subsequence(0).buffer).to.not.equal(bs0.buffer);
    expect(bs0.subsequence(0).toString()).to.equal(bs0.toString());

    expect(bs1.subsequence(0).byteLength).to.equal(1000);
    expect(bs1.subsequence(999).byteLength).to.equal(1);
    expect(bs1.subsequence(1000).byteLength).to.equal(0);
    expect(bs1.subsequence(0).buffer).to.not.equal(bs1.buffer);
    expect(bs1.subsequence(0).toString()).to.equal(bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.fromArray(a2);
    expect(JSON.stringify(a2)).to.equal(JSON.stringify(bs2.subsequence(0).toArray()));

    expect(() => {
      bs1.subsequence(1001);
    }).to.throw(RangeError, "start").with.property("name", "RangeError");

  });

  it("subsequence(number, number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    expect(bs0.subsequence(0, 0).byteLength).to.equal(0);
    expect(bs0.subsequence(0, 1).byteLength).to.equal(0);
    expect(bs0.subsequence(0, 0).buffer).to.not.equal(bs0.buffer);
    expect(bs0.subsequence(0, 0).toString()).to.equal(bs0.toString());

    expect(bs1.subsequence(0, 1000).byteLength).to.equal(1000);
    expect(bs1.subsequence(999, 1000).byteLength).to.equal(1);
    expect(bs1.subsequence(1000, 1000).byteLength).to.equal(0);
    expect(bs1.subsequence(1000, 1001).byteLength).to.equal(0);
    expect(bs1.subsequence(0, 1000).buffer).to.not.equal(bs1.buffer);
    expect(bs1.subsequence(0, 1000).toString()).to.equal(bs1.toString());
    expect(bs1.subsequence(0, 1001).toString()).to.equal(bs1.toString());

    expect(bs1.subsequence(100, 200).toString()).to.equal(ByteSequence.fromArrayBufferView(bs1.getView(Uint8Array, 100, 100)).toString());

    expect(() => {
      bs1.subsequence(1, -1);
    }).to.throw(TypeError, "end").with.property("name", "TypeError");

    expect(() => {
      bs1.subsequence(2, 1);
    }).to.throw(RangeError, "end").with.property("name", "RangeError");

  });

});

describe("ByteSequence.prototype.getUint8View", () => {
  it("getUint8View()", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getUint8View();
    const v2 = bs1.getUint8View();
    expect(v1.byteLength).to.equal(1000);
    expect(v1 instanceof Uint8Array).to.equal(true);
    expect(v1).to.not.equal(v2);

    v1[0] = 255;
    expect(v2[0]).to.equal(255);

  });

  it("getUint8View(number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getUint8View(500);
    expect(v1.byteLength).to.equal(500);

    v1[0] = 255;
    expect(bs1.getUint8View()[500]).to.equal(255);

  });

  it("getUint8View(number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getUint8View(500, 1);
    expect(v1.byteLength).to.equal(1);

  });

});

describe("ByteSequence.prototype.getDataView", () => {
  it("getDataView()", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getDataView();
    const v2 = bs1.getDataView();
    expect(v1.byteLength).to.equal(1000);
    expect(v1 instanceof DataView).to.equal(true);
    expect(v1).to.not.equal(v2);

    v1.setUint8(0, 255);
    expect(v2.getUint8(0)).to.equal(255);

  });

  it("getDataView(number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getDataView(500);
    expect(v1.byteLength).to.equal(500);

    v1.setUint8(0, 255);
    expect(bs1.getDataView().getUint8(500)).to.equal(255);

  });

  it("getDataView(number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    const v1 = bs1.getDataView(500, 1);
    expect(v1.byteLength).to.equal(1);

  });

});

describe("ByteSequence.prototype.getView", () => {
  it("getView()", () => {
    const bs1 = ByteSequence.allocate(1000);
    expect(bs1.getView().byteLength).to.equal(1000);
  });

  it("getView(Uint8Array)", () => {
    const bs1 = ByteSequence.allocate(1000);
    expect(bs1.getView(Uint8Array).byteLength).to.equal(1000);
  });

  it("getView(DataView)", () => {
    const bs1 = ByteSequence.allocate(1000);
    expect(bs1.getView(DataView).byteLength).to.equal(1000);
  });

  it("getView(*)", () => {
    const bs1 = ByteSequence.allocate(1000);
    expect(() => {
      bs1.getView(Blob as unknown as Uint8ArrayConstructor);
    }).to.throw(TypeError, "ctor").with.property("name", "TypeError");

  });

  it("getView({}, number)", () => {
    const bs1 = ByteSequence.allocate(1000);
    expect(bs1.getView(Uint8Array, 0).byteLength).to.equal(1000);
    expect(bs1.getView(Uint8Array, 500).byteLength).to.equal(500);
  });

  it("getView({}, number, number)", () => {
    const bs1 = ByteSequence.allocate(1000);

    expect(bs1.getView(Uint8Array, 0, 1).byteLength).to.equal(1);
    expect(bs1.getView(Uint8Array, 0, 1000).byteLength).to.equal(1000);
    expect(bs1.getView(Uint8Array, 1, 999).byteLength).to.equal(999);
    expect(bs1.getView(Uint8Array, 999, 1).byteLength).to.equal(1);
    expect(bs1.getView(Uint8Array, 1000, 0).byteLength).to.equal(0);
    expect(bs1.getView(Uint8Array, 0, 0).byteLength).to.equal(0);

    expect(() => {
      bs1.getView(Uint8Array, -1, 1);
    }).to.throw(TypeError, "byteOffset").with.property("name", "TypeError");

    expect(() => {
      bs1.getView(Uint8Array, 1001, 1);
    }).to.throw(RangeError, "byteOffset").with.property("name", "RangeError");

    expect(() => {
      bs1.getView(Uint8Array, Number.NaN, 1);
    }).to.throw(TypeError, "byteOffset").with.property("name", "TypeError");

    expect(() => {
      bs1.getView(Uint8Array, 1.5, 1);
    }).to.throw(TypeError, "byteOffset").with.property("name", "TypeError");

    expect(() => {
      bs1.getView(Uint8Array, 0, Number.NaN);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      bs1.getView(Uint8Array, 0, 1.5);
    }).to.throw(TypeError, "byteLength").with.property("name", "TypeError");

    expect(() => {
      bs1.getView(Uint8Array, 0, 1001);
    }).to.throw(RangeError, "byteLength").with.property("name", "RangeError");

    expect(() => {
      bs1.getView(Uint8Array, 999, 2);
    }).to.throw(RangeError, "byteLength").with.property("name", "RangeError");

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.fromArrayBufferView(b0);
    expect(bs0.getView(Uint8Array, 0, 0)).to.not.equal(b0);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.allocate(100);

    const x = bs1.getView(Uint8Array, 0, 100);
    expect(x[0]).to.equal(0);

    x[0] = 255;
    expect(x[0]).to.equal(255);
    expect(new Uint8Array(bs1.buffer)[0]).to.equal(255);

    x[0] = 32;
    expect(x[0]).to.equal(32);
    expect(new Uint8Array(bs1.buffer)[0]).to.equal(32);

  });

});

describe("ByteSequence.prototype.equals", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs0b = ByteSequence.allocate(0);

  const bs1 =  ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.fromArray([255, 0, 127, 1]);

  it("equals(ByteSequence)", () => {
    expect(bs0.equals(bs0)).to.equal(true);
    expect(bs0.equals(bs0b)).to.equal(true);

    expect(bs1.equals(bs1)).to.equal(true);
    expect(bs1.equals(bs1b)).to.equal(true);
    expect(bs1.equals(bs0)).to.equal(false);
    expect(bs0.equals(bs1)).to.equal(false);

  });

  it("equals(Uint8Array)", () => {
    expect(bs0.equals(new Uint8Array(0))).to.equal(true);
    expect(bs1.equals(bs1.toUint8Array())).to.equal(true);
    expect(bs1.equals(Uint8Array.of(255, 0, 127, 1))).to.equal(true);

    expect(bs1.equals(Uint8Array.of(255, 0, 123, 1))).to.equal(false);
    expect(bs1.equals(Uint8Array.of(255, 0, 127, 1, 5))).to.equal(false);
    expect(bs1.equals(Uint8Array.of(255, 0, 127))).to.equal(false);

  });

  it("equals(Array<number>)", () => {
    expect(bs0.equals([])).to.equal(true);
    expect(bs1.equals(bs1.toArray())).to.equal(true);
    expect(bs1.equals([255, 0, 127, 1])).to.equal(true);

    expect(bs1.equals([255, 0, 127, 2])).to.equal(false);
    expect(bs1.equals([255, 0, 127, 1, 2])).to.equal(false);
    expect(bs1.equals([255, 0, 127])).to.equal(false);

  });

  it("equals(ArrayBuffer)", () => {
    expect(bs0.equals(bs0.buffer)).to.equal(true);
    expect(bs1.equals(bs1b.buffer)).to.equal(true);

  });

});

describe("ByteSequence.prototype.startsWith", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs0b = ByteSequence.allocate(0);

  const bs1 =  ByteSequence.fromArrayBufferView(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.fromArray([255, 0, 127, 1]);

  it("startsWith(ByteSequence)", () => {
    expect(bs0.startsWith(bs0)).to.equal(true);
    expect(bs0.startsWith(bs0b)).to.equal(true);

    expect(bs1.startsWith(bs1)).to.equal(true);
    expect(bs1.startsWith(bs1b)).to.equal(true);
    expect(bs1.startsWith(bs0)).to.equal(true);
    expect(bs0.startsWith(bs1)).to.equal(false);

  });

  it("startsWith(Uint8Array)", () => {
    expect(bs0.startsWith(new Uint8Array(0))).to.equal(true);
    expect(bs1.startsWith(bs1.toUint8Array())).to.equal(true);
    expect(bs1.startsWith(Uint8Array.of(255, 0, 127, 1))).to.equal(true);

    expect(bs1.startsWith(Uint8Array.of(255, 0, 123, 1))).to.equal(false);
    expect(bs1.startsWith(Uint8Array.of(255, 0, 127, 1, 5))).to.equal(false);
    expect(bs1.startsWith(Uint8Array.of(255, 0, 127))).to.equal(true);

    expect(bs1.startsWith([255, 0, 127, 2])).to.equal(false);
    expect(bs1.startsWith([255, 0, 127, 1, 2])).to.equal(false);
    expect(bs1.startsWith([255, 0, 127])).to.equal(true);
    expect(bs1.startsWith([255, 0])).to.equal(true);
    expect(bs1.startsWith([255])).to.equal(true);
    expect(bs1.startsWith([])).to.equal(true);

  });

  it("startsWith(Array<number>)", () => {
    expect(bs0.startsWith([])).to.equal(true);
    expect(bs1.startsWith(bs1.toArray())).to.equal(true);
    expect(bs1.startsWith([255, 0, 127, 1])).to.equal(true);

    expect(bs1.startsWith([255, 0, 127, 2])).to.equal(false);
    expect(bs1.startsWith([255, 0, 127, 1, 2])).to.equal(false);
    expect(bs1.startsWith([255, 0, 127])).to.equal(true);

  });

  it("startsWith(Iterable<number>)", () => {
    const a = function*() {
      return;
    };
    expect(bs0.startsWith(a())).to.equal(true);

    const b = function*() {
      yield 1;
      yield 2;
    };
    expect(bs1.startsWith(b())).to.equal(false);

    const c = function*() {
      yield 255;
      yield 0;
    };
    expect(bs1.startsWith(c())).to.equal(true);

  });

  it("startsWith(ArrayBuffer)", () => {
    expect(bs0.startsWith(bs0.buffer)).to.equal(true);
    expect(bs1.startsWith(bs1b.buffer)).to.equal(true);
    expect(bs1.startsWith(bs0.buffer)).to.equal(true);

  });

  it("startsWith(*)", () => {
    expect(() => {
      bs0.startsWith(null as unknown as Uint8Array);
    }).to.throw(TypeError, "iterable").with.property("name", "TypeError");

    expect(() => {
      bs0.startsWith(undefined as unknown as Uint8Array);
    }).to.throw(TypeError, "iterable").with.property("name", "TypeError");

    expect(() => {
      bs1.startsWith(["255"] as unknown as Uint8Array);
    }).to.throw(TypeError, "otherBytes").with.property("name", "TypeError");

  });

});

describe("ByteSequence.prototype.segment", () => {
  it("segment(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    expect(() => {
      bs1.segment(0);
    }).to.throw(TypeError, "segmentByteLength").with.property("name", "TypeError");

    expect(() => {
      bs1.segment(-1);
    }).to.throw(TypeError, "segmentByteLength").with.property("name", "TypeError");

    expect(() => {
      bs1.segment(undefined as unknown as number);
    }).to.throw(TypeError, "segmentByteLength").with.property("name", "TypeError");

    const i1 = bs1.segment(100);
    let i = 0;
    for (const i1i of i1) {
      expect(i1i.byteLength).to.equal(100);
      expect(JSON.stringify(i1i.toArray())).to.equal(JSON.stringify([...bs1.getView(Uint8Array, i, 100)]));
      i = i + 100;
    }
    expect(i).to.equal(1000);

    const i1b = bs1.segment(150);
    let ib = 0;
    for (const i1i of i1b) {
      if (ib < 900) {
        expect(i1i.byteLength).to.equal(150);
        expect(JSON.stringify(i1i.toArray())).to.equal(JSON.stringify([...bs1.getView(Uint8Array, ib, 150)]));
      }
      else {
        expect(i1i.byteLength).to.equal(100);
        expect(JSON.stringify(i1i.toArray())).to.equal(JSON.stringify([...bs1.getView(Uint8Array, ib, 100)]));
      }
      ib = ib + 150;
    }
    expect(ib).to.equal(1050);

  });

});

declare interface Temp1 {
  toWeb(s: fs.ReadStream): ReadableStream<Uint8Array>;
}

describe("ByteSequence.fromStream", () => {
  it("fromStream(ReadableStream)", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r = await ByteSequence.fromStream(stream);
    expect(r.byteLength).to.equal(128);

  });

  it("fromStream(ReadableStream, {totalByteLength:number})", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r = await ByteSequence.fromStream(stream, {totalByteLength:128});
    expect(r.byteLength).to.equal(128);

    const stream2 = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r2 = await ByteSequence.fromStream(stream2, {totalByteLength:64});
    expect(r2.byteLength).to.equal(128);

    const stream3 = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const r3 = await ByteSequence.fromStream(stream3, {totalByteLength:512});
    expect(r3.byteLength).to.equal(128);

  });

  it("fromStream(ReadableStream, { on*: function })", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const evtNames: string[] = [];
    const data: { total: number, loaded: number, lengthComputable?: boolean } = {
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
      onloadstart: listener,
      onloadend: listener,
      onprogress: listener,
      onabort: listener,
      ontimeout: listener,
      onerror: listener,
      onload: listener,
    });
    expect(r.byteLength).to.equal(128);
    expect(evtNames.filter(n => n === "loadstart").length).to.equal(1);
    expect(evtNames.filter(n => n === "loadend").length).to.equal(1);
    expect(evtNames.filter(n => n === "progress").length).to.greaterThanOrEqual(1);
    expect(evtNames.filter(n => n === "abort").length).to.equal(0);
    expect(evtNames.filter(n => n === "timeout").length).to.equal(0);
    expect(evtNames.filter(n => n === "error").length).to.equal(0);
    expect(evtNames.filter(n => n === "load").length).to.equal(1);
    expect(data.total).to.equal(0);
    expect(data.loaded).to.equal(128);
    expect(data.lengthComputable).to.equal(false);

  });

  it("fromStream(ReadableStream, { totalByteLength:number, on*: function })", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 }));
    const evtNames: string[] = [];
    const data: { total: number, loaded: number, lengthComputable?: boolean } = {
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
      totalByteLength: 128,
      onloadstart: listener,
      onloadend: listener,
      onprogress: listener,
      onabort: listener,
      ontimeout: listener,
      onerror: listener,
      onload: listener,
    });
    expect(r.byteLength).to.equal(128);
    expect(evtNames.filter(n => n === "loadstart").length).to.equal(1);
    expect(evtNames.filter(n => n === "loadend").length).to.equal(1);
    expect(evtNames.filter(n => n === "progress").length).to.greaterThanOrEqual(1);
    expect(evtNames.filter(n => n === "abort").length).to.equal(0);
    expect(evtNames.filter(n => n === "timeout").length).to.equal(0);
    expect(evtNames.filter(n => n === "error").length).to.equal(0);
    expect(evtNames.filter(n => n === "load").length).to.equal(1);
    expect(data.total).to.equal(128);
    expect(data.loaded).to.equal(128);
    expect(data.lengthComputable).to.equal(true);

  });

  it("fromStream(ReadableStream, { totalByteLength:number, signal: AbortSignal, on*: function })", async () => {
    const stream = (Readable as unknown as Temp1).toWeb(fs.createReadStream("./test/_data/4096.txt", { highWaterMark: 64 }));
    const evtNames: string[] = [];
    const data: { total: number, loaded: number, lengthComputable?: boolean } = {
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
    }, 5);
    try {
      const r = await ByteSequence.fromStream(stream, {
        totalByteLength: 4096,
        signal: ac.signal,
        onloadstart: listener,
        onloadend: listener,
        onprogress: listener,
        onabort: listener,
        ontimeout: listener,
        onerror: listener,
        onload: listener,
      });
      throw new Error();
    }catch(e){
      expect((e as Error)?.name).to.equal("AbortError");
    }
    expect(evtNames.filter(n => n === "loadstart").length).to.equal(1);
    expect(evtNames.filter(n => n === "loadend").length).to.equal(1);
    expect(evtNames.filter(n => n === "progress").length).to.greaterThanOrEqual(1);
    expect(evtNames.filter(n => n === "abort").length).to.equal(1);
    expect(evtNames.filter(n => n === "timeout").length).to.equal(0);
    expect(evtNames.filter(n => n === "error").length).to.equal(0);
    expect(evtNames.filter(n => n === "load").length).to.equal(0);
    expect(data.total).to.equal(4096);
    expect(data.loaded).to.greaterThanOrEqual(1);
    expect(data.lengthComputable).to.equal(true);

  });

});

describe("ByteSequence.fromRequestOrResponse", () => {
  it("fromRequestOrResponse(Response)", async () => {
    const res1 = new Response(Uint8Array.of(255,254,253,252));
    const {data:b1, options:meta1} = await ByteSequence.fromRequestOrResponse(res1);
    expect(b1.byteLength).to.equal(4);
    expect(meta1).to.equal(undefined);

    // 読み取り済みのを再度読もうとした
    try {
      await ByteSequence.fromRequestOrResponse(res1);
      throw new Error();
    }
    catch (e) {
      expect(e?.name).to.equal("InvalidStateError");
      expect(e?.message).to.equal("bodyUsed:true");
    }

  });

  it("fromRequestOrResponse(Response)", async () => {
    const headers1 = new Headers();
    headers1.append("content-type", "text/plain");
    const res1 = new Response(Uint8Array.of(255,254,253,252), {headers:headers1});
    const {data:b1, options:meta1} = await ByteSequence.fromRequestOrResponse(res1);
    expect(b1.byteLength).to.equal(4);
    expect(meta1.type).to.equal("text/plain");

  });

  it("fromRequestOrResponse(Response, {verifyHeaders:function})", async () => {
    const options1 = {
      verifyHeaders: (h) => {
        const verified = h.get("Content-Type") === "text/plain";
        return [verified];
      },
    };
    const headers1 = new Headers();
    headers1.append("content-type", "text/plain");
    const res1 = new Response(Uint8Array.of(255,254,253,252), {headers:headers1});
    const {data:b1, options:meta1} = await ByteSequence.fromRequestOrResponse(res1, options1);
    expect(b1.byteLength).to.equal(4);
    expect(meta1.type).to.equal("text/plain");

  });

  it("fromRequestOrResponse(Response, {verifyHeaders:function})", async () => {
    const options1 = {
      verifyHeaders: (h) => {
        const verified = h.get("Content-Type") === "text/csv";
        return [verified, verified === true ? undefined : "err1"];
      },
    };
    const headers1 = new Headers();
    headers1.append("content-type", "text/plain");
    const res1 = new Response(Uint8Array.of(255,254,253,252), {headers:headers1});
    try {
      await ByteSequence.fromRequestOrResponse(res1, options1);
      throw new Error();
    }
    catch (e) {
      expect(e?.name).to.equal("Error");
      expect(e?.message).to.equal("err1");
    }

  });

});

//TODO toRequest

//TODO toResponse
