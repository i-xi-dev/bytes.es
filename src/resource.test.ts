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

describe("Resource.prototype.data", () => {
  it("data", async () => {
    const b1 = new _Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1 as unknown as Blob);
    const b11v = b11.data.view;
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);

  });

});
