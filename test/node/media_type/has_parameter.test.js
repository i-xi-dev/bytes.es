import assert from "node:assert";
import { MediaType } from "../../../node.mjs";

describe("MediaType.prototype.hasParameter", () => {
  it("hasParameter(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.hasParameter("charset"), false);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.hasParameter("charset"), true);

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.hasParameter("charset"), true);

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.hasParameter("charset"), true);

  });

});
