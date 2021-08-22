import assert from "node:assert";
import { MediaType } from "../../dist/media_type.js";

describe("MediaType.prototype.subtype", () => {
  it("subtype", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.subtype, "plain");

    const i0b = MediaType.fromString("text/PLAIN");
    assert.strictEqual(i0b.subtype, "plain");

  });

});
