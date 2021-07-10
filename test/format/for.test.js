import { ByteFormat } from "../../dist/format/index.js";

describe("ByteFormat.for", () => {
  test("for(ByteFormatName)", () => {
    const i1 = ByteFormat.for("hexadecimal");
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    expect(Object.isFrozen(ByteFormat)).toBe(true);
    expect(Object.isFrozen(i1)).toBe(true);

    const i2 = ByteFormat.for("decimal");
    expect(i2.format(Uint8Array.of(0))).toBe("000");
    expect(i2.format(Uint8Array.of(255))).toBe("255");

    const i3 = ByteFormat.for("octal");
    expect(i3.format(Uint8Array.of(0))).toBe("000");
    expect(i3.format(Uint8Array.of(255))).toBe("377");

    const i4 = ByteFormat.for("binary");
    expect(i4.format(Uint8Array.of(0))).toBe("00000000");
    expect(i4.format(Uint8Array.of(255))).toBe("11111111");

  });

  test("ByteFormat(ByteFormatName, ByteFormatOptions) - zeroPaddedLength", () => {
    const i1 = ByteFormat.for("hexadecimal", {});
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    const i3 = ByteFormat.for("hexadecimal", {zeroPaddedLength:3});
    expect(i3.format(Uint8Array.of(0))).toBe("000");
    expect(i3.format(Uint8Array.of(255))).toBe("0ff");

    const i4 = ByteFormat.for("hexadecimal", {zeroPaddedLength:2});
    expect(i4.format(Uint8Array.of(0))).toBe("00");
    expect(i4.format(Uint8Array.of(255))).toBe("ff");

    expect(() => {
      ByteFormat.for("hexadecimal", {zeroPaddedLength:1.1});
    }).toThrow(new TypeError("zeroPaddedLength"));

    expect(() => {
      ByteFormat.for("hexadecimal", {zeroPaddedLength:1});
    }).toThrow(new RangeError("zeroPaddedLength"));

    expect(() => {
      ByteFormat.for("decimal", {zeroPaddedLength:2});
    }).toThrow(new RangeError("zeroPaddedLength"));

    expect(() => {
      ByteFormat.for("binary", {zeroPaddedLength:7});
    }).toThrow(new RangeError("zeroPaddedLength"));

    expect(() => {
      ByteFormat.for("octal", {zeroPaddedLength:2});
    }).toThrow(new RangeError("zeroPaddedLength"));



  });

  test("ByteFormat(ByteFormatName, ByteFormatOptions) - upperCase", () => {
    const i2 = ByteFormat.for("hexadecimal", {upperCase:true});
    expect(i2.format(Uint8Array.of(0))).toBe("00");
    expect(i2.format(Uint8Array.of(255))).toBe("FF");
  });

  test("ByteFormat(ByteFormatName, ByteFormatOptions) - prefix", () => {
    const i2 = ByteFormat.for("hexadecimal", {prefix:"--"});
    expect(i2.format(Uint8Array.of(0))).toBe("--00");
    expect(i2.format(Uint8Array.of(255))).toBe("--ff");

    const i3 = ByteFormat.for("hexadecimal", {prefix:""});
    expect(i3.format(Uint8Array.of(0))).toBe("00");
    expect(i3.format(Uint8Array.of(255))).toBe("ff");
  });

  test("ByteFormat(ByteFormatName, ByteFormatOptions) - suffix", () => {
    const i2 = ByteFormat.for("hexadecimal", {suffix:"--"});
    expect(i2.format(Uint8Array.of(0))).toBe("00--");
    expect(i2.format(Uint8Array.of(255))).toBe("ff--");

    const i3 = ByteFormat.for("hexadecimal", {suffix:""});
    expect(i3.format(Uint8Array.of(0))).toBe("00");
    expect(i3.format(Uint8Array.of(255))).toBe("ff");
  });

});
