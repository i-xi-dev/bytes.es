import { FileLike } from "../../../dist/media/file_like.js";
import { Blob } from "buffer";

describe("FileLike.prototype.bytes", () => {
  test("bytes", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await FileLike.fromBlob(b1);
    const b11v = b11.bytes.view();
    expect(b11v[0]).toBe(255);
    expect(b11v[1]).toBe(0);
    expect(b11v[2]).toBe(1);
    expect(b11v[3]).toBe(127);

  });

});
