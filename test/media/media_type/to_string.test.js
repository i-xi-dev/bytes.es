import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.toString", () => {
  test("toString()", () => {
    const i0 = MediaType.fromString("text/PLAIN");
    expect(i0.toString()).toBe("text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.toString()).toBe("text/plain;charset=uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.toString()).toBe("text/plain;charset=uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.toString()).toBe("text/plain;charset=uTf-8;x=9");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.toString()).toBe("text/plain;charset=uTf-8;x=9");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.toString()).toBe("text/plain;charset=\"uTf-8 \";x=9");

    const i6 = MediaType.fromString("text/plain;y=7; charset=uTf-8 ; x=9");
    expect(i6.toString()).toBe("text/plain;charset=uTf-8;x=9;y=7");

  });

});
