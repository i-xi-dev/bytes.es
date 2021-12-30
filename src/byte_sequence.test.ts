import { ByteSequence } from "./byte_sequence";
import { uint8 } from "./index";

describe("ByteSequence.allocate", () => {
  it("allocate(number)", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1024 * 1024 * 1);

    expect(bs0.buffer.byteLength).toBe(0);
    expect(bs1.buffer.byteLength).toBe(1024 * 1024 * 1);

    expect(() => {
      ByteSequence.allocate(-1);
    }).toThrowError({
      name: "TypeError",
      message: "byteCount"
    });

    expect(() => {
      ByteSequence.allocate(1.5);
    }).toThrowError({
      name: "TypeError",
      message: "byteCount"
    });

    expect(() => {
      ByteSequence.allocate(Number.NaN);
    }).toThrowError({
      name: "TypeError",
      message: "byteCount"
    });

  });

});

describe("ByteSequence.prototype.count", () => {
  it("count", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.count).toBe(0);
    expect(bs1.count).toBe(1000);

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

    expect(bs0.buffer).toBe(a0);
    expect(bs0.buffer).toBe(bs0b.buffer);
    expect(bs1.buffer).not.toBe(a1);
    expect(bs1.buffer).not.toBe(bs1b.buffer);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = ByteSequence.wrap(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.buffer);
    expect(x[0]).toBe(0);

    x[0] = 255;
    expect(x[0]).toBe(255);
    expect(new Uint8Array(bs1.buffer)[0]).toBe(255);

  });

});

describe("ByteSequence.wrap", () => {
  it("wrap(ArrayBuffer)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = ByteSequence.wrap(bytes0.buffer);
    const bs1 = ByteSequence.wrap(bytes1.buffer);  

    expect(bs0 instanceof ByteSequence).toBe(true);
    expect(bs0.count).toBe(0);
    expect(bs1.count).toBe(5);

  });

  it("wrap(Uint8Array)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = ByteSequence.wrap(bytes0);
    const bs1 = ByteSequence.wrap(bytes1);

    expect(bs0 instanceof ByteSequence).toBe(true);
    expect(bs0.count).toBe(0);
    expect(bs1.count).toBe(5);
  });

  it("wrap(*)", () => {
    expect(() => {
      ByteSequence.wrap([] as unknown as Uint8Array);
    }).toThrowError({
      name: "TypeError",
      message: "bytes"
    });
  });

  it("コンストラクターに渡したArrayBufferへの操作は、自身に影響する", () => {
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs1 = ByteSequence.wrap(bytes1.buffer);
    const a1 = bytes1.buffer;
    const nb1 = new Uint8Array(a1);
    nb1.set([1,2,3,4]);

    const bs1v = bs1.view();
    expect(bs1v[0]).toBe(1);
    expect(bs1v[1]).toBe(2);
    expect(bs1v[2]).toBe(3);
    expect(bs1v[3]).toBe(4);
    expect(bs1v[4]).toBe(100);

  });

});

describe("ByteSequence.from", () => {
  it("from(Array<number>)", () => {
    const a0: uint8[] = [9,8,7,6,5,4,3,2,0,255];
    const bs0 = ByteSequence.from(a0);

    expect(bs0.count).toBe(10);
    const bs0a = bs0.view();
    expect(bs0a[8]).toBe(0);
    expect(bs0a[9]).toBe(255);

    const a1: uint8[] = [];
    const bs1 = ByteSequence.from(a1);

    expect(bs1.count).toBe(0);

    const a2 = ["a"] as unknown as uint8[];
    expect(() => {
      ByteSequence.from(a2);
    }).toThrowError({
      name: "TypeError",
      message: "bytes"
    });

  });

  it("from(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.from(a0);

    expect(bs0.count).toBe(10);
    const bs0a = bs0.view();
    expect(bs0a[0]).toBe(9);
    expect(bs0a[9]).toBe(0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.from(a1);

    expect(bs1.count).toBe(0);

  });

  it("from(ArrayBuffer)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.from(a0.buffer);

    expect(bs0.count).toBe(10);
    const bs0a = bs0.view();
    expect(bs0a[0]).toBe(9);
    expect(bs0a[9]).toBe(0);

    const a1 = new ArrayBuffer(0);
    const bs1 = ByteSequence.from(a1);

    expect(bs1.count).toBe(0);

  });

  it("from(ByteSequence)", () => {
    const bs1 = ByteSequence.generateRandom(256);
    const bs1c = ByteSequence.from(bs1);

    expect(bs1).not.toBe(bs1c);
    expect(JSON.stringify(bs1.toArray())).toBe(JSON.stringify(bs1c.toArray()));

  });

  it("fromに渡したUint8Arrayへの操作は、自身に影響しない", () => {
    const a0 = Uint8Array.of(255,254,253,252,251);
    const bs0 = ByteSequence.from(a0);

    const bs0v = bs0.view();
    expect(bs0v[0]).toBe(255);
    expect(bs0v[1]).toBe(254);
    expect(bs0v[2]).toBe(253);
    expect(bs0v[3]).toBe(252);
    expect(bs0v[4]).toBe(251);

    a0[0] = 1;

    const bs0v2 = bs0.view();
    expect(bs0v2[0]).toBe(255);

  });

});

describe("ByteSequence.prototype.toUint8Array", () => {
  it("toUint8Array()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.toUint8Array().length).toBe(0);
    expect(bs1.toUint8Array().length).toBe(1000);

    const a2s = [1,2,3,4,5];
    const a2 = Uint8Array.from(a2s);
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2s)).toBe(JSON.stringify([...bs2.toUint8Array()]));

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const a0 = Uint8Array.of(0,255);
    const bs0 = ByteSequence.from(a0);
    expect(bs0.toUint8Array()).not.toBe(a0);

  });

  it("返却値への操作は、自身に影響しない", () => {
    const bs0 = ByteSequence.of(0,255);
    const a0 = bs0.toUint8Array();

    expect(a0[1]).toBe(255);
    a0[1] = 1;
    expect(bs0.view()[1]).toBe(255);

  });

});

describe("ByteSequence.prototype.toArray", () => {
  it("toArray()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.toArray().length).toBe(0);
    expect(bs1.toArray().length).toBe(1000);

    const a2: uint8[] = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2)).toBe(JSON.stringify(bs2.toArray()));

  });

});

describe("ByteSequence.of", () => {
  it("of(Array<number>)", () => {
    const bs0 = ByteSequence.of(1,2,3,4,5);
    expect(bs0.buffer.byteLength).toBe(5);

    const a1: uint8[] = [1,2,3,4,5,6];
    const bs1 = ByteSequence.of(...a1);
    expect(bs1.buffer.byteLength).toBe(6);

    expect(bs1.view()[2]).toBe(3);

  });

});

describe("ByteSequence.generateRandom", () => {
  it("generateRandom(number)", () => {
    const bs0 = ByteSequence.generateRandom(0);
    const bs1 = ByteSequence.generateRandom(65536);

    expect(bs0.buffer.byteLength).toBe(0);
    expect(bs1.buffer.byteLength).toBe(65536);

    expect(() => {
      ByteSequence.generateRandom(-1);
    }).toThrowError({
      name: "TypeError",
      message: "byteCount"
    });

    expect(() => {
      ByteSequence.generateRandom(1.5);
    }).toThrowError({
      name: "TypeError",
      message: "byteCount"
    });

    expect(() => {
      ByteSequence.generateRandom(Number.NaN);
    }).toThrowError({
      name: "TypeError",
      message: "byteCount"
    });

    expect(() => {
      ByteSequence.generateRandom(65537);
    }).toThrowError({
      name: "RangeError",
      message: "byteCount"
    });

  });

});

describe("ByteSequence.fromBinaryString", () => {
  it("fromBinaryString(string)", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    const bsa = bsbs.toArray();

    expect(bsa[0]).toBe(65);
    expect(bsa[1]).toBe(66);
    expect(bsa[2]).toBe(67);
    expect(bsa[3]).toBe(68);

    expect(ByteSequence.fromBinaryString("").count).toBe(0);

    expect(() => {
      ByteSequence.fromBinaryString("あ");
    }).toThrowError({
      name: "TypeError",
      message: "input"
    });

    expect(() => {
      ByteSequence.fromBinaryString("\u0100");
    }).toThrowError({
      name: "TypeError",
      message: "input"
    });

  });

});

describe("ByteSequence.prototype.toBinaryString", () => {
  it("toBinaryString()", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    expect(bsbs.toBinaryString()).toBe(binStr);

  });

});

describe("ByteSequence.parse", () => {
  it("parse(string)", () => {
    const bs0 = ByteSequence.parse("41424344");
    expect(bs0.toString()).toBe("41424344");
    expect(ByteSequence.parse("").toString()).toBe("");

    expect(() => {
      ByteSequence.parse("あ");
    }).toThrowError({
      name: "TypeError",
      message: "parse error: あ"
    });

    expect(() => {
      ByteSequence.parse("GG");
    }).toThrowError({
      name: "TypeError",
      message: "parse error: GG"
    });

  });

  it("parse(string, {radix:number})", () => {
    const bs0 = ByteSequence.parse("41424344", {radix:16});
    expect(bs0.toString()).toBe("41424344");

    const bs1 = ByteSequence.parse("065066067068", {radix:10});
    expect(bs1.toString()).toBe("41424344");

    const bs2 = ByteSequence.parse("101102103104", {radix:8});
    expect(bs2.toString()).toBe("41424344");

    const bs3 = ByteSequence.parse("01000001010000100100001101000100", {radix:2});
    expect(bs3.toString()).toBe("41424344");

  });

  it("parse(string, FormatOptions)", () => {
    const bs0 = ByteSequence.parse("0041004200430044", {radix:16, paddedLength:4, upperCase:true});
    expect(bs0.toString()).toBe("41424344");

  });

});

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  it("format()", () => {
    expect(bs0.format()).toBe("");
    expect(bs1.format()).toBe("413C0A20A9");

  });

  it("format({radix:number})", () => {
    expect(bs1.format({radix:16})).toBe("413C0A20A9");
    expect(bs1.format({radix:10})).toBe("065060010032169");

  });

  it("format(FormatOptions)", () => {
    expect(bs1.format({radix:16,upperCase:false})).toBe("413c0a20a9");
    expect(bs1.format({radix:16,paddedLength:3,upperCase:false})).toBe("04103c00a0200a9");
    expect(bs1.format({radix:10,paddedLength:4})).toBe("00650060001000320169");

  });

});

describe("ByteSequence.fromBase64", () => {
  it("fromBase64(string)", () => {
    const bs0 = ByteSequence.fromBase64("");
    expect(bs0.count).toBe(0);

    const bs1 = ByteSequence.fromBase64("AwIBAP/+/fw=");
    expect(bs1.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

  });

  it("fromBase64(string, Object)", () => {
    const bs0 = ByteSequence.fromBase64("", {});
    expect(bs0.count).toBe(0);

    const bs1 = ByteSequence.fromBase64("AwIBAP/+/fw=", {});
    expect(bs1.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

    const bs1b = ByteSequence.fromBase64(" A wIBAP/+/fw ", {});
    expect(bs1b.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

    const bs1c = ByteSequence.fromBase64("AwIBAP/+/fw", {padEnd:false});
    expect(bs1c.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const bs2 = ByteSequence.fromBase64("AwIBAP_-_fw=", {table:rfc4648urlTable});
    expect(bs2.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

    const bs2b = ByteSequence.fromBase64(" A wIBAP_-_fw ", {table:rfc4648urlTable});
    expect(bs2b.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

    const bs2c = ByteSequence.fromBase64("AwIBAP_-_fw", {table:rfc4648urlTable,padEnd:false});
    expect(bs2c.toArray().join(",")).toBe("3,2,1,0,255,254,253,252");

  });

});

describe("ByteSequence.prototype.toBase64", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);

  it("toBase64()", () => {
    const s1 = bs0.toBase64();
    expect(s1.length).toBe(0);

    const s11 = bs1.toBase64();
    expect(s11).toBe("AwIBAP/+/fw=");

  });

  it("toBase64(Base64Options)", () => {
    const s1 = bs0.toBase64({});
    expect(s1.length).toBe(0);

    const s11 = bs1.toBase64({});
    expect(s11).toBe("AwIBAP/+/fw=");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const s11b = bs1.toBase64({table:rfc4648urlTable});
    expect(s11b).toBe("AwIBAP_-_fw=");

    const s11c = bs1.toBase64({padEnd:false});
    expect(s11c).toBe("AwIBAP/+/fw");

  });

});

describe("ByteSequence.fromPercent", () => {
  it("fromPercent(string)", () => {
    const bs1 = ByteSequence.fromPercent("");
    expect(bs1.count).toBe(0);

    const bs2 = ByteSequence.fromPercent("%03");
    expect(bs2.view()[0]).toBe(0x03);

  });

  it("fromPercent(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercent("", {});
    expect(bs0.count).toBe(0);

  });

});

describe("ByteSequence.prototype.toPercent", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);
  const bs3 = ByteSequence.of(0x20,0x21,0x22,0x23);

  it("toPercent()", () => {
    const s1 = bs0.toPercent();
    expect(s1.length).toBe(0);

    const s11 = bs1.toPercent();
    expect(s11).toBe("%03%02%01%00%FF%FE%FD%FC");

  });

  it("toPercent(PercentOptions)", () => {
    const s1 = bs0.toPercent({});
    expect(s1.length).toBe(0);

    const s11 = bs1.toPercent({});
    expect(s11).toBe("%03%02%01%00%FF%FE%FD%FC");

    const s3a = bs3.toPercent({spaceAsPlus:true});
    expect(s3a).toBe("+%21%22%23");

    const s3b = bs3.toPercent({encodeSet:[]});
    expect(s3b).toBe(" !\"#");

  });

});

describe("ByteSequence.prototype.toString", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  it("toString()", () => {
    expect(bs0.toString()).toBe("");
    expect(bs1.toString()).toBe("413C0A20A9");

  });

});

describe("ByteSequence.prototype.toJSON", () => {
  it("toJSON()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    expect(bs0.toJSON().length).toBe(0);
    expect(bs1.toJSON().length).toBe(1000);

    const a2: uint8[] = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2)).toBe(JSON.stringify(bs2.toJSON()));

  });

});

describe("ByteSequence.prototype.toSha256", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha256()", async () => {
    const s1 = await bs0.toSha256();
    expect(s1.format()).toBe("E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855");

  });

});

//expect(xxx).toBe(xxx);