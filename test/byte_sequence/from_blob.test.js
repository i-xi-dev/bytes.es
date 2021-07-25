import { ByteSequence } from "../../dist/byte_sequence.js";
import { Blob } from "buffer";

describe("ByteSequence.fromBlob", () => {
  test("fromBlob(blob)", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await ByteSequence.fromBlob(b1);
    const b11v = b11.view();
    expect(b11v[0]).toBe(255);
    expect(b11v[1]).toBe(0);
    expect(b11v[2]).toBe(1);
    expect(b11v[3]).toBe(127);
    expect(b11.count).toBe(4);

  });

});
