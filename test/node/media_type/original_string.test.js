import assert from "node:assert";
import { MediaType } from "../../../node/index.mjs";

describe("MediaType.prototype.originalString", () => {
  it("originalString", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.originalString, "text/plain");

    const i0b = MediaType.fromString("text/plain ");
    assert.strictEqual(i0b.originalString, "text/plain");

    const i0c = MediaType.fromString("text/plain; charset=Utf-8");
    assert.strictEqual(i0c.originalString, "text/plain; charset=Utf-8");

  });

});
