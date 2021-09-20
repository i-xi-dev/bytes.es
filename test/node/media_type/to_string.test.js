import assert from "node:assert";
import { MediaType } from "../../../node/index.mjs";

describe("MediaType.prototype.toString", () => {
  it("toString()", () => {
    const i0 = MediaType.fromString("text/PLAIN");
    assert.strictEqual(i0.toString(), "text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.toString(), "text/plain;charset=uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.toString(), "text/plain;charset=uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.toString(), "text/plain;charset=uTf-8;x=9");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.toString(), "text/plain;charset=uTf-8;x=9");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.toString(), "text/plain;charset=\"uTf-8 \";x=9");

    const i6 = MediaType.fromString("text/plain;y=7; charset=uTf-8 ; x=9");
    assert.strictEqual(i6.toString(), "text/plain;charset=uTf-8;x=9;y=7");

  });

});
