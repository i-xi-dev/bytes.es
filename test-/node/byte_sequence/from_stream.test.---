import assert from "node:assert";
import fs from "node:fs";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";
import { ByteStreamReader } from "../../../dist/index.js";

describe("ByteStreamReader.readAsUint8Array", async () => {
  it("ByteStreamReader.readAsUint8Array(ReadableStream)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bytes0 = await ByteStreamReader.readAsUint8Array(Readable.toWeb(stream0));
    assert.strictEqual(bytes0.byteLength, 0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes = await ByteStreamReader.readAsUint8Array(Readable.toWeb(stream));
    assert.strictEqual(bytes.byteLength, 128);

  });

  it("ByteStreamReader.readAsUint8Array(ReadableStream, number)/initiate()", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bytes0 = await ByteStreamReader.readAsUint8Array(Readable.toWeb(stream0), 0);
    assert.strictEqual(bytes0.byteLength, 0);
    assert.strictEqual(bytes0.buffer.byteLength, 0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes = await ByteStreamReader.readAsUint8Array(Readable.toWeb(stream), 128);
    assert.strictEqual(bytes.byteLength, 128);
    assert.strictEqual(bytes.buffer.byteLength, 128);

    const stream5 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes5 = await ByteStreamReader.readAsUint8Array(Readable.toWeb(stream5), 1024);
    assert.strictEqual(bytes5.byteLength, 128);
    assert.strictEqual(bytes5.buffer.byteLength, 128);

    const stream6 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes6 = await ByteStreamReader.readAsUint8Array(Readable.toWeb(stream6), 32);
    assert.strictEqual(bytes6.byteLength, 128);
    assert.strictEqual(bytes6.buffer.byteLength, 128);

  });

});
