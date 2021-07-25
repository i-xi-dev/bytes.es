import { FileLike } from "../../../dist/media/file_like.js";
import { Blob } from "buffer";

describe("FileLike.prototype.mediaType", () => {
  test("mediaType", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await FileLike.fromBlob(b1);
    expect(b11.mediaType.toString()).toBe("text/plain");

  });

});
