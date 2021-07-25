import { ByteSequence } from "../../dist/byte_sequence.js";
import fs from "fs";

describe("ByteSequence.fromByteStream", () => {
  test("fromByteStream(NodeJS.ReadStream)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0 = await ByteSequence.fromByteStream(stream0);
    expect(bs0.count).toBe(0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bs1 = await ByteSequence.fromByteStream(stream);
    expect(bs1.count).toBe(128);

  });

  test("fromByteStream(NodeJS.ReadStream, number)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0 = await ByteSequence.fromByteStream(stream0, 0);
    expect(bs0.count).toBe(0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bs1 = await ByteSequence.fromByteStream(stream, 128);
    expect(bs1.count).toBe(128);

    const stream0b = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    await expect(Promise.all([
      ByteSequence.fromByteStream(stream0b, 128)
    ])).rejects.toThrow("Stream size too short");

    const streamb = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    await expect(Promise.all([
      ByteSequence.fromByteStream(streamb, 64)
    ])).rejects.toThrow("Stream size too long");

  });

  test("fromByteStream(NodeJS.ReadStream, number, StreamReadingOptions)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0 = await ByteSequence.fromByteStream(stream0, 0, {});
    expect(bs0.count).toBe(0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bs1 = await ByteSequence.fromByteStream(stream, 128, {});
    expect(bs1.count).toBe(128);

    const stream0b = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bs0b = await ByteSequence.fromByteStream(stream0b, 128, { acceptSizeMismatch:true, })
    expect(bs0b.count).toBe(0);

    const streamb = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const ac = new AbortController();
    ac.abort();
    await expect(
      ByteSequence.fromByteStream(streamb, 128, { abortSignal: ac.signal })
    ).rejects.toThrow("already aborted");

  });

});
