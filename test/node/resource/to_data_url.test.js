import assert from "node:assert";
import { Resource } from "../../../node/index.mjs";

describe("Resource.prototype.toDataUrl", () => {
  it("toDataUrl()", async () => {
    const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
    const b11 = await Resource.fromBlob(b1);
    const b11b = b11.toDataUrl();

    assert.strictEqual(b11b.toString(), "data:text/plain;base64,QQABfw==");
  });

});
