import assert from "node:assert";
import { Resource } from "../../../node/index.mjs";

describe("Resource.prototype.mediaType", () => {
  it("mediaType", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

  });

});
