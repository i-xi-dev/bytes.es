import assert from "node:assert";
import { Resource } from "../../../node.mjs";

describe("Resource.prototype.toDataUrl", () => {
  it("toDataUrl()", async () => {
    // const fr = new FileReader();

    const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
    const b11 = await Resource.fromBlob(b1);
    const b11b = b11.toDataUrl();

    // const b11t = await ((blob) => {
    //   return new Promise((resolve) => {
    //     fr.onload = () => {
    //       resolve(fr.result);
    //     };
    //     fr.readAsDataURL(blob);
    //   });
    // })(new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" }));

    // assert.strictEqual(b11b, b11t);
    assert.strictEqual(b11b.toString(), "data:text/plain;base64,QQABfw==");
  });

});