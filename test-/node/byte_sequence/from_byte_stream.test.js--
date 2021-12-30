import assert from "node:assert";
import fs from "node:fs";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.fromByteStream", () => {
  it("fromByteStream(NodeJS.ReadStream)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0 = await ByteSequence.fromByteStream(stream0);
    assert.strictEqual(bs0.count, 0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bs1 = await ByteSequence.fromByteStream(stream);
    assert.strictEqual(bs1.count, 128);

  });

  it("fromByteStream(NodeJS.ReadStream, number)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0 = await ByteSequence.fromByteStream(stream0, 0);
    assert.strictEqual(bs0.count, 0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bs1 = await ByteSequence.fromByteStream(stream, 128);
    assert.strictEqual(bs1.count, 128);

    const stream0b = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    await assert.rejects(async () => {
      await ByteSequence.fromByteStream(stream0b, 128)
    }, {
      message: "Stream size too short"
    });

    const streamb = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    await assert.rejects(async () => {
      await ByteSequence.fromByteStream(streamb, 64)
    }, {
      message: "Stream size too long"
    });

  });

  it("fromByteStream(NodeJS.ReadStream, number, StreamReadingOptions)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0 = await ByteSequence.fromByteStream(stream0, 0, {});
    assert.strictEqual(bs0.count, 0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bs1 = await ByteSequence.fromByteStream(stream, 128, {});
    assert.strictEqual(bs1.count, 128);

    const stream0b = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0b = await ByteSequence.fromByteStream(stream0b, 128, { acceptSizeMismatch:true, })
    assert.strictEqual(bs0b.count, 0);

    const streamb = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const ac = new AbortController();
    ac.abort();
    await assert.rejects(async () => {
      await ByteSequence.fromByteStream(streamb, 128, { signal: ac.signal })
    }, {
      message: "already aborted"
    });

  });

});
