import assert from "node:assert";
import { MediaType } from "../../../node/index.mjs";

describe("MediaType.prototype.toJSON", () => {
  it("toJSON()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.toJSON(), "text/plain");

  });

});
