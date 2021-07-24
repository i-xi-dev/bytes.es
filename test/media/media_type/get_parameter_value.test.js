import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.getParameterValue", () => {
  test("getParameterValue(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.getParameterValue("charset")).toBe(null);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.getParameterValue("charset")).toBe("uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.getParameterValue("charset")).toBe("uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.getParameterValue("charset")).toBe("uTf-8");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.getParameterValue("charset")).toBe("uTf-8");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.getParameterValue("charset")).toBe("uTf-8 ");

  });

});
