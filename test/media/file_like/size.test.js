import { FileLike } from "../../../dist/media/file_like.js";
import { Blob } from "buffer";

describe("FileLike.prototype.size", () => {
  test("size", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await FileLike.fromBlob(b1);
    expect(b11.size).toBe(4);

  });

});
