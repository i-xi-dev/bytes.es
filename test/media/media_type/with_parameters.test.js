import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.withParameters", () => {
  test("withParameters(Array)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.withParameters([]).toString()).toBe("text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.withParameters([]).toString()).toBe("text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.withParameters([]).toString()).toBe("text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.withParameters([]).toString()).toBe("text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.withParameters([]).toString()).toBe("text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.withParameters([]).toString()).toBe("text/plain");

    const i6 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i6.withParameters([["hoge","http://"],["charset","utf-16be"]]).toString()).toBe("text/plain;charset=utf-16be;hoge=\"http://\"");

  });

});
