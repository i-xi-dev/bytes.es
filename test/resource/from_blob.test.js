import assert from "node:assert";
import { Blob } from "node:buffer";
import { Resource } from "../../dist/resource.js";

describe("Resource.fromBlob", () => {
  it("fromBlob(blob)", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    const b11v = b11.bytes.view();
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);
    assert.strictEqual(b11.size, 4);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

  });

});
