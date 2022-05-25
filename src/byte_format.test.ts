import { expect } from '@esm-bundle/chai';
import { ByteSequence } from "./index";

describe("ByteSequence.prototype.format", () => {
  it("format()", () => {
    expect(ByteSequence.from(Uint8Array.of()).format()).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format()).to.equal("FFFEFDFC00010203");

  });

  it("format({radix:16})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({radix:16})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({radix:16})).to.equal("FFFEFDFC00010203");

  });

  it("format({radix:*})", () => {

    expect(() => {
      ByteSequence.from(Uint8Array.of()).format({radix:1.5 as unknown as ByteSequence.Format.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.from(Uint8Array.of()).format({radix:15 as unknown as ByteSequence.Format.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.from(Uint8Array.of()).format({radix:"1" as unknown as ByteSequence.Format.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

  });

  it("format({radix:10})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({radix:10})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({radix:10})).to.equal("255254253252000001002003");

  });

  it("format({radix:8})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({radix:8})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({radix:8})).to.equal("377376375374000001002003");

  });

  it("format({radix:2})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({radix:2})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({radix:2})).to.equal("1111111111111110111111011111110000000000000000010000001000000011");

  });

  it("format({lowerCase:true})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({lowerCase:true})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({lowerCase:true})).to.equal("fffefdfc00010203");

  });

  it("format({paddedLength:4})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({paddedLength:4})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({paddedLength:4})).to.equal("00FF00FE00FD00FC0000000100020003");

    expect(() => {
      ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({paddedLength:1});
    }).to.throw(RangeError, "paddedLength").with.property("name", "RangeError");

    expect(() => {
      ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({paddedLength:1.5});
    }).to.throw(TypeError, "paddedLength").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({paddedLength:"1" as unknown as number});
    }).to.throw(TypeError, "paddedLength").with.property("name", "TypeError");

  });

  it("format({prefix:string})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({prefix:"x"})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({prefix:"x"})).to.equal("xFFxFExFDxFCx00x01x02x03");

  });

  it("format({suffix:string})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({suffix:"x"})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({suffix:"x"})).to.equal("FFxFExFDxFCx00x01x02x03x");

  });

  it("format({separator:string})", () => {
    expect(ByteSequence.from(Uint8Array.of()).format({separator:"  "})).to.equal("");
    expect(ByteSequence.from(Uint8Array.of(255,254,253,252,0,1,2,3)).format({separator:"  "})).to.equal("FF  FE  FD  FC  00  01  02  03");

  });

});

describe("ByteSequence.parse", () => {
  it("parse(string)", () => {
    expect(JSON.stringify(ByteSequence.parse("").toArray())).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("FFFEFDFC00010203"))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {radix:16})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {radix:16}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("FFFEFDFC00010203", {radix:16}))).to.equal("[255,254,253,252,0,1,2,3]");
    expect(JSON.stringify(ByteSequence.parse("fffefdfc00010203", {radix:16}))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {radix:10})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {radix:10}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("255254253252000001002003", {radix:10}))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      ByteSequence.parse("0311F", {radix:10});
    }).to.throw(TypeError, "parse error: 1F").with.property("name", "TypeError");

  });

  it("parse(string, {radix:8})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {radix:8}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("377376375374000001002003", {radix:8}))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {radix:2})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {radix:2}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("1111111111111110111111011111110000000000000000010000001000000011", {radix:2}))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {lowerCase:true})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {lowerCase:true}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("FFFEFDFC00010203", {lowerCase:true}))).to.equal("[255,254,253,252,0,1,2,3]");
    expect(JSON.stringify(ByteSequence.parse("fffefdfc00010203", {lowerCase:true}))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {paddedLength:4})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {paddedLength:4}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("00FF00FE00FD00FC0000000100020003", {paddedLength:4}))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {prefix:string})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {prefix:"x"}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("xFFxFExFDxFCx00x01x02x03", {prefix:"x"}))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      ByteSequence.parse("xFFyFE", {prefix:"x"});
    }).to.throw(TypeError, "unprefixed").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.parse("xFFFE", {prefix:"x"});
    }).to.throw(TypeError, "unprefixed").with.property("name", "TypeError");

  });

  it("parse(string, {suffix:string})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {suffix:"x"}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("FFxFExFDxFCx00x01x02x03x", {suffix:"x"}))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      ByteSequence.parse("FFxFEy", {suffix:"x"});
    }).to.throw(TypeError, "unsuffixed").with.property("name", "TypeError");

    expect(() => {
      ByteSequence.parse("FFxFE", {suffix:"x"});
    }).to.throw(TypeError, "unsuffixed").with.property("name", "TypeError");

  });

  it("parse(string, {separator:string})", () => {
    expect(JSON.stringify(ByteSequence.parse("", {separator:"  "}))).to.equal("[]");
    expect(JSON.stringify(ByteSequence.parse("FF  FE  FD  FC  00  01  02  03", {separator:"  "}))).to.equal("[255,254,253,252,0,1,2,3]");

  });

});
