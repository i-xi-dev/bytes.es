import assert from "node:assert";
import { Resource } from "./resource";

describe("Resource.prototype.mediaType", () => {
  it("mediaType", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

  });

});

describe("Resource.prototype.data", () => {
  it("data", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    const b11v = b11.data.view;
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);

  });

});

describe("Resource.prototype.size", () => {
  it("size", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    assert.strictEqual(b11.size, 4);

  });

});

describe("Resource.fromBlob", () => {
  it("fromBlob(blob)", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    const b11v = b11.data.view;
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);
    assert.strictEqual(b11.size, 4);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

  });

});

describe("Resource.prototype.toBlob", () => {
  it("toBlob()", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    const b11b = b11.toBlob();
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");

  });

});
