import assert from "node:assert";
import { Blob } from "node:buffer";
import { Resource } from "../../dist/resource.js";

describe("Resource.prototype.size", () => {
  it("size", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    assert.strictEqual(b11.size, 4);

  });

});
