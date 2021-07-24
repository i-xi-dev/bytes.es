import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.withoutParameters", () => {
  test("withoutParameters()", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.withoutParameters().toString()).toBe("text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.withoutParameters().toString()).toBe("text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.withoutParameters().toString()).toBe("text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.withoutParameters().toString()).toBe("text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.withoutParameters().toString()).toBe("text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.withoutParameters().toString()).toBe("text/plain");

  });

});
