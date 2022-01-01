import assert from "node:assert";
import { Blob as _Blob } from "node:buffer";
import { Resource } from "./resource";

describe("Resource.prototype.mediaType", () => {
  it("mediaType", async () => {
    const b1 = new _Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1 as Blob);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

  });

});
