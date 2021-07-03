import { ByteFormat } from "../../src/format";

describe("ByteFormat", (): void => {
  test("ByteFormat()", (): void => {
    const i1 = new ByteFormat();
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    expect(Object.isFrozen(ByteFormat)).toBe(true);
    expect(Object.isFrozen(i1)).toBe(true);
  });

  test("ByteFormat(ByteFormatOptions) - radix", (): void => {
    const i1 = new ByteFormat({});
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    const i2 = new ByteFormat({radix:10});
    expect(i2.format(Uint8Array.of(0))).toBe("000");
    expect(i2.format(Uint8Array.of(255))).toBe("255");

    const i3 = new ByteFormat({radix:8});
    expect(i3.format(Uint8Array.of(0))).toBe("000");
    expect(i3.format(Uint8Array.of(255))).toBe("377");

    const i4 = new ByteFormat({radix:2});
    expect(i4.format(Uint8Array.of(0))).toBe("00000000");
    expect(i4.format(Uint8Array.of(255))).toBe("11111111");

    const i5 = new ByteFormat({radix:16});
    expect(i5.format(Uint8Array.of(0))).toBe("00");
    expect(i5.format(Uint8Array.of(255))).toBe("ff");
  });

  test("ByteFormat(ByteFormatOptions) - zeroPaddedLength", (): void => {
    const i1 = new ByteFormat({});
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    const i2 = new ByteFormat({zeroPaddedLength:1});
    expect(i2.format(Uint8Array.of(0))).toBe("00");
    expect(i2.format(Uint8Array.of(255))).toBe("ff");

    const i3 = new ByteFormat({zeroPaddedLength:3});
    expect(i3.format(Uint8Array.of(0))).toBe("000");
    expect(i3.format(Uint8Array.of(255))).toBe("0ff");

    const i4 = new ByteFormat({zeroPaddedLength:2});
    expect(i4.format(Uint8Array.of(0))).toBe("00");
    expect(i4.format(Uint8Array.of(255))).toBe("ff");

    expect(() => {
      new ByteFormat({zeroPaddedLength:1.1});
    }).toThrow(new TypeError("zeroPaddedLength"));
  });

  test("ByteFormat(ByteFormatOptions) - upperCase", (): void => {
    const i1 = new ByteFormat({});
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    const i2 = new ByteFormat({upperCase:true});
    expect(i2.format(Uint8Array.of(0))).toBe("00");
    expect(i2.format(Uint8Array.of(255))).toBe("FF");
  });

  test("ByteFormat(ByteFormatOptions) - prefix", (): void => {
    const i1 = new ByteFormat({});
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    const i2 = new ByteFormat({prefix:"--"});
    expect(i2.format(Uint8Array.of(0))).toBe("--00");
    expect(i2.format(Uint8Array.of(255))).toBe("--ff");

    const i3 = new ByteFormat({prefix:""});
    expect(i3.format(Uint8Array.of(0))).toBe("00");
    expect(i3.format(Uint8Array.of(255))).toBe("ff");
  });

  test("ByteFormat(ByteFormatOptions) - suffix", (): void => {
    const i1 = new ByteFormat({});
    expect(i1.format(Uint8Array.of(0))).toBe("00");
    expect(i1.format(Uint8Array.of(255))).toBe("ff");

    const i2 = new ByteFormat({suffix:"--"});
    expect(i2.format(Uint8Array.of(0))).toBe("00--");
    expect(i2.format(Uint8Array.of(255))).toBe("ff--");

    const i3 = new ByteFormat({suffix:""});
    expect(i3.format(Uint8Array.of(0))).toBe("00");
    expect(i3.format(Uint8Array.of(255))).toBe("ff");
  });

});
