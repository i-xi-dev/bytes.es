import assert from "node:assert";
import { MediaType } from "../../../node/index.mjs";

describe("MediaType.prototype.withoutParameters", () => {
  it("withoutParameters()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.withoutParameters().toString(), "text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.withoutParameters().toString(), "text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.withoutParameters().toString(), "text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.withoutParameters().toString(), "text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.withoutParameters().toString(), "text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.withoutParameters().toString(), "text/plain");

  });

});
