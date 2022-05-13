import { expect } from '@esm-bundle/chai';
import { ByteFormat } from "./byte_format";

describe("ByteFormat.format", () => {
  it("format(Uint8Array)", () => {
    expect(ByteFormat.format(Uint8Array.of())).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("FFFEFDFC00010203");

  });

  it("format(Uint8Array, {radix:16})", () => {
    expect(ByteFormat.format(Uint8Array.of(), {radix:16})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {radix:16})).to.equal("FFFEFDFC00010203");

  });

  it("format(Uint8Array, {radix:*})", () => {

    expect(() => {
      ByteFormat.parse("0311F", {radix:1.5 as unknown as ByteFormat.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

    expect(() => {
      ByteFormat.parse("0311F", {radix:15 as unknown as ByteFormat.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

    expect(() => {
      ByteFormat.parse("0311F", {radix:"1" as unknown as ByteFormat.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

  });

  it("format(Uint8Array, {radix:10})", () => {
    expect(ByteFormat.format(Uint8Array.of(), {radix:10})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {radix:10})).to.equal("255254253252000001002003");

  });

  it("format(Uint8Array, {radix:8})", () => {
    expect(ByteFormat.format(Uint8Array.of(), {radix:8})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {radix:8})).to.equal("377376375374000001002003");

  });

  it("format(Uint8Array, {radix:2})", () => {
    expect(ByteFormat.format(Uint8Array.of(), {radix:2})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {radix:2})).to.equal("1111111111111110111111011111110000000000000000010000001000000011");

  });

  it("format(Uint8Array, {lowerCase:true})", () => {
    expect(ByteFormat.format(Uint8Array.of(), {lowerCase:true})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {lowerCase:true})).to.equal("fffefdfc00010203");

  });

  it("new ByteFormat(16, {paddedLength:4})/format(Uint8Array)", () => {
    expect(ByteFormat.format(Uint8Array.of(), {paddedLength:4})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {paddedLength:4})).to.equal("00FF00FE00FD00FC0000000100020003");

    expect(() => {
      ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {paddedLength:1});
    }).to.throw(RangeError, "paddedLength").with.property("name", "RangeError");

    expect(() => {
      ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {paddedLength:1.5});
    }).to.throw(TypeError, "paddedLength").with.property("name", "TypeError");

    expect(() => {
      ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {paddedLength:"1" as unknown as number});
    }).to.throw(TypeError, "paddedLength").with.property("name", "TypeError");

  });

  it("new ByteFormat(16,{prefix:string})/format(Uint8Array)", () => {
    expect(ByteFormat.format(Uint8Array.of(), {prefix:"x"})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {prefix:"x"})).to.equal("xFFxFExFDxFCx00x01x02x03");

  });

  it("new ByteFormat(16,{suffix:string})/format(Uint8Array)", () => {
    expect(ByteFormat.format(Uint8Array.of(), {suffix:"x"})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {suffix:"x"})).to.equal("FFxFExFDxFCx00x01x02x03x");

  });

  it("new ByteFormat(16,{separator:string})/format(Uint8Array)", () => {
    expect(ByteFormat.format(Uint8Array.of(), {separator:"  "})).to.equal("");
    expect(ByteFormat.format(Uint8Array.of(255,254,253,252,0,1,2,3), {separator:"  "})).to.equal("FF  FE  FD  FC  00  01  02  03");

  });

});

describe("ByteFormat.parse", () => {
  it("parse(string)", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("FFFEFDFC00010203")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {radix:16})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {radix:16})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("FFFEFDFC00010203", {radix:16})))).to.equal("[255,254,253,252,0,1,2,3]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("fffefdfc00010203", {radix:16})))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {radix:10})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {radix:10})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("255254253252000001002003", {radix:10})))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      ByteFormat.parse("0311F", {radix:10});
    }).to.throw(TypeError, "parse error: 1F").with.property("name", "TypeError");

  });

  it("parse(string, {radix:8})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {radix:8})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("377376375374000001002003", {radix:8})))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {radix:2})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {radix:2})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("1111111111111110111111011111110000000000000000010000001000000011", {radix:2})))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {lowerCase:true})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {lowerCase:true})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("FFFEFDFC00010203", {lowerCase:true})))).to.equal("[255,254,253,252,0,1,2,3]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("fffefdfc00010203", {lowerCase:true})))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {paddedLength:4})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {paddedLength:4})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("00FF00FE00FD00FC0000000100020003", {paddedLength:4})))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("parse(string, {prefix:string})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {prefix:"x"})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("xFFxFExFDxFCx00x01x02x03", {prefix:"x"})))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      ByteFormat.parse("xFFyFE", {prefix:"x"});
    }).to.throw(TypeError, "unprefixed").with.property("name", "TypeError");

    expect(() => {
      ByteFormat.parse("xFFFE", {prefix:"x"});
    }).to.throw(TypeError, "unprefixed").with.property("name", "TypeError");

  });

  it("parse(string, {suffix:string})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {suffix:"x"})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("FFxFExFDxFCx00x01x02x03x", {suffix:"x"})))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      ByteFormat.parse("FFxFEy", {suffix:"x"});
    }).to.throw(TypeError, "unsuffixed").with.property("name", "TypeError");

    expect(() => {
      ByteFormat.parse("FFxFE", {suffix:"x"});
    }).to.throw(TypeError, "unsuffixed").with.property("name", "TypeError");

  });

  it("parse(string, {separator:string})", () => {
    expect(JSON.stringify(Array.from(ByteFormat.parse("", {separator:"  "})))).to.equal("[]");
    expect(JSON.stringify(Array.from(ByteFormat.parse("FF  FE  FD  FC  00  01  02  03", {separator:"  "})))).to.equal("[255,254,253,252,0,1,2,3]");

  });

});

describe("ByteFormat.Formatter.get", () => {
  it("get()", () => {
    const format = ByteFormat.Formatter.get();

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("FFFEFDFC00010203");

  });

  it("get(Object)", () => {
    const format = ByteFormat.Formatter.get({radix:10});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("255254253252000001002003");

    const format2 = ByteFormat.Formatter.get({radix:10});
    expect(format).to.equal(format2);

  });

});

describe("ByteFormat.Formatter.prototype.format", () => {
  it("new ByteFormat.Formatter()/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter();

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("FFFEFDFC00010203");

  });

  it("new ByteFormat.Formatter({radix:16})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({radix:16});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("FFFEFDFC00010203");

  });

  it("new ByteFormat.Formatter({radix:*})/format(Uint8Array)", () => {

    expect(() => {
      new ByteFormat.Formatter({radix:15 as ByteFormat.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

    expect(() => {
      new ByteFormat.Formatter({radix:"1" as unknown as ByteFormat.Radix});
    }).to.throw(TypeError, "radix").with.property("name", "TypeError");

  });

  it("new ByteFormat.Formatter({radix:10})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({radix:10});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("255254253252000001002003");

  });

  it("new ByteFormat.Formatter({radix:8})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({radix:8});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("377376375374000001002003");

  });

  it("new ByteFormat.Formatter({radix:2})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({radix:2});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("1111111111111110111111011111110000000000000000010000001000000011");

  });

  it("new ByteFormat.Formatter({lowerCase:true})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({lowerCase:true});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("fffefdfc00010203");

  });

  it("new ByteFormat.Formatter({paddedLength:4})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({paddedLength:4});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("00FF00FE00FD00FC0000000100020003");

    expect(() => {
      new ByteFormat.Formatter({paddedLength:1});
    }).to.throw(RangeError, "paddedLength").with.property("name", "RangeError");

    expect(() => {
      new ByteFormat.Formatter({paddedLength:1.5});
    }).to.throw(TypeError, "paddedLength").with.property("name", "TypeError");

  });

  it("new ByteFormat.Formatter({prefix:string})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({prefix:"x"});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("xFFxFExFDxFCx00x01x02x03");

  });

  it("new ByteFormat.Formatter({suffix:string})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({suffix:"x"});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("FFxFExFDxFCx00x01x02x03x");

  });

  it("new ByteFormat.Formatter({separator:string})/format(Uint8Array)", () => {
    const format = new ByteFormat.Formatter({separator:"  "});

    expect(format.format(Uint8Array.of())).to.equal("");
    expect(format.format(Uint8Array.of(255,254,253,252,0,1,2,3))).to.equal("FF  FE  FD  FC  00  01  02  03");

  });

});

describe("ByteFormat.Parser.get", () => {
  it("get()", () => {
    const format = ByteFormat.Parser.get();

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("FFFEFDFC00010203")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("get(Object)", () => {
    const format = ByteFormat.Parser.get({radix:10});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("255254253252000001002003")))).to.equal("[255,254,253,252,0,1,2,3]");

    const format2 = ByteFormat.Parser.get({radix:10});
    expect(format).to.equal(format2);

  });

});

describe("ByteFormat.Parser.prototype.parse", () => {
  it("new ByteFormat.Parser()/parse(string)", () => {
    const format = new ByteFormat.Parser();

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("FFFEFDFC00010203")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("new ByteFormat.Parser({radix:16})/parse(string)", () => {
    const format = new ByteFormat.Parser({radix:16});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("FFFEFDFC00010203")))).to.equal("[255,254,253,252,0,1,2,3]");
    expect(JSON.stringify(Array.from(format.parse("fffefdfc00010203")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("new ByteFormat.Parser({radix:10})/parse(string)", () => {
    const format = new ByteFormat.Parser({radix:10});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("255254253252000001002003")))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      format.parse("0311F");
    }).to.throw(TypeError, "parse error: 1F").with.property("name", "TypeError");

  });

  it("new ByteFormat.Parser({radix:8})/parse(string)", () => {
    const format = new ByteFormat.Parser({radix:8});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("377376375374000001002003")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("new ByteFormat.Parser({radix:2})/parse(string)", () => {
    const format = new ByteFormat.Parser({radix:2});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("1111111111111110111111011111110000000000000000010000001000000011")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("new ByteFormat.Parser({lowerCase:true})/parse(string)", () => {
    const format = new ByteFormat.Parser({lowerCase:true});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("FFFEFDFC00010203")))).to.equal("[255,254,253,252,0,1,2,3]");
    expect(JSON.stringify(Array.from(format.parse("fffefdfc00010203")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("new ByteFormat.Parser({paddedLength:4})/parse(string)", () => {
    const format = new ByteFormat.Parser({paddedLength:4});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("00FF00FE00FD00FC0000000100020003")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

  it("new ByteFormat.Parser({prefix:string})/parse(string)", () => {
    const format = new ByteFormat.Parser({prefix:"x"});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("xFFxFExFDxFCx00x01x02x03")))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      format.parse("xFFyFE");
    }).to.throw(TypeError, "unprefixed").with.property("name", "TypeError");

    expect(() => {
      format.parse("xFFFE");
    }).to.throw(TypeError, "unprefixed").with.property("name", "TypeError");

  });

  it("new ByteFormat.Parser({suffix:string})/parse(string)", () => {
    const format = new ByteFormat.Parser({suffix:"x"});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("FFxFExFDxFCx00x01x02x03x")))).to.equal("[255,254,253,252,0,1,2,3]");

    expect(() => {
      format.parse("FFxFEy");
    }).to.throw(TypeError, "unsuffixed").with.property("name", "TypeError");

    expect(() => {
      format.parse("FFxFE");
    }).to.throw(TypeError, "unsuffixed").with.property("name", "TypeError");

  });

  it("new ByteFormat.Parser({separator:string})/parse(string)", () => {
    const format = new ByteFormat.Parser({separator:"  "});

    expect(JSON.stringify(Array.from(format.parse("")))).to.equal("[]");
    expect(JSON.stringify(Array.from(format.parse("FF  FE  FD  FC  00  01  02  03")))).to.equal("[255,254,253,252,0,1,2,3]");

  });

});
