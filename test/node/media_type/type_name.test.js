import assert from "node:assert";
import { MediaType } from "../../../node.mjs";

describe("MediaType.prototype.type", () => {
  it("type", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.type, "text");

  });

});
