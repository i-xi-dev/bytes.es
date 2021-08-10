import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.hasParameter", () => {
  test("hasParameter(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.hasParameter("charset")).toBe(false);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.hasParameter("charset")).toBe(true);

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.hasParameter("charset")).toBe(true);

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.hasParameter("charset")).toBe(true);

  });

});
