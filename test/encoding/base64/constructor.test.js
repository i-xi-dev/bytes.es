import { Base64Encoding } from "../../../dist/encoding/base64.js";

describe("Base64Encoding", () => {
  test("Base64Encoding()", () => {
    const i1 = new Base64Encoding();
    expect(i1.encode(Uint8Array.of(255))).toBe("/w==");
  });

  test("Base64Encoding(Base64EncodingOptions)", () => {
    const i1 = new Base64Encoding();
    expect(i1.encode(Uint8Array.of(255))).toBe("/w==");
    expect(i1.encode(Uint8Array.of(251))).toBe("+w==");

    const i2 = new Base64Encoding({});
    expect(i2.encode(Uint8Array.of(255))).toBe("/w==");
    expect(i2.encode(Uint8Array.of(251))).toBe("+w==");

    const i3 = new Base64Encoding({_62ndChar:"-"});
    expect(i3.encode(Uint8Array.of(251))).toBe("-w==");

    const i4 = new Base64Encoding({_63rdChar:"_"});
    expect(i4.encode(Uint8Array.of(255))).toBe("_w==");

    const i5 = new Base64Encoding({usePadding:false});
    expect(i5.encode(Uint8Array.of(255))).toBe("/w");

    const i5b = new Base64Encoding({usePadding:undefined});
    expect(i5b.encode(Uint8Array.of(255))).toBe("/w==");

  });

});
