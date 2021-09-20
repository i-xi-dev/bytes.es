import assert from "node:assert";
import { MediaType } from "../../../node/index.mjs";

describe("MediaType.prototype.getParameterValue", () => {
  it("getParameterValue(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.getParameterValue("charset"), null);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.getParameterValue("charset"), "uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.getParameterValue("charset"), "uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.getParameterValue("charset"), "uTf-8");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.getParameterValue("charset"), "uTf-8");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.getParameterValue("charset"), "uTf-8 ");

  });

});
