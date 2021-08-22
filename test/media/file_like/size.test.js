import assert from "node:assert";
import { Blob } from "node:buffer";
import { FileLike } from "../../../dist/media/file_like.js";

describe("FileLike.prototype.size", () => {
  it("size", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await FileLike.fromBlob(b1);
    assert.strictEqual(b11.size, 4);

  });

});
