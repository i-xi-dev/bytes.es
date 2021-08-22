import assert from "node:assert";
import { MediaType } from "../../dist/media_type.js";

describe("MediaType.prototype.withParameters", () => {
  it("withParameters(Array)", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.withParameters([]).toString(), "text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.withParameters([]).toString(), "text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.withParameters([]).toString(), "text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.withParameters([]).toString(), "text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.withParameters([]).toString(), "text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.withParameters([]).toString(), "text/plain");

    const i6 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i6.withParameters([["hoge","http://"],["charset","utf-16be"]]).toString(), "text/plain;charset=utf-16be;hoge=\"http://\"");

  });

});
