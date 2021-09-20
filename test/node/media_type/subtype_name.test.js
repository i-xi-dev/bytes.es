import assert from "node:assert";
import { MediaType } from "../../../node/index.mjs";

describe("MediaType.prototype.subtype", () => {
  it("subtype", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.subtype, "plain");

    const i0b = MediaType.fromString("text/PLAIN");
    assert.strictEqual(i0b.subtype, "plain");

  });

});
