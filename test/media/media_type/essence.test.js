import assert from "node:assert";
import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.essence", () => {
  it("essence", () => {
    const i0 = MediaType.fromString("text/plain;charset=utf-8");
    assert.strictEqual(i0.essence, "text/plain");

  });

});
