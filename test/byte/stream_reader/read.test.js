import { ByteStreamReader } from "../../../dist/byte/index.js";
import fs from "fs";
import { Readable } from "stream";

describe("ByteStreamReader.prototype.read", () => {
  test("read(NodeJS.ReadableStream)", async () => {
    const r0 = new ByteStreamReader();
    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });

    const bytes = await r0.read(stream);
    expect(bytes.byteLength).toBe(128);

    // 読み取り中に読取
    const r0b = new ByteStreamReader();
    const stream3a = new Readable({
      read() {}
    });
    const stream3b = new Readable({
      read() {}
    });
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i > 10) {
        stream3a.push(null);
        stream3b.push(null);
        clearInterval(t);
      }
      else {
        stream3a.push(new Uint8Array(64));
        stream3b.push(new Uint8Array(64));
      }
    }, 2);
    await expect(Promise.all([
      r0b.read(stream3a),
      r0b.read(stream3b)
    ])).rejects.toThrow("invalid state");

  });

  test("read(NodeJS.ReadableStream, number)", async () => {
    const r0 = new ByteStreamReader();

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes = await r0.read(stream, 128);
    expect(bytes.byteLength).toBe(128);
    expect(bytes.buffer.byteLength).toBe(128);

    // const stream2 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    // const bytes2 = await r0.read(stream2, 256);
    // expect(bytes2.byteLength).toBe(128);
    // expect(bytes2.buffer.byteLength).toBe(256);

    const stream3 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    await expect(
      r0.read(stream3, 64)
    ).rejects.toThrow("Stream size too long");

    const r0b = new ByteStreamReader();
    const stream4 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    await expect(
      r0b.read(stream4, 256)
    ).rejects.toThrow("Stream size too short");

  });

  test("read(NodeJS.ReadableStream, number, StreamReadingOptions)", async () => {
    const r0 = new ByteStreamReader();

    // abortSignal
    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const ac = new AbortController();
    const bytes = await r0.read(stream, 128, {abortSignal: ac.signal});
    expect(bytes.byteLength).toBe(128);

    const stream2 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const ac2 = new AbortController();
    ac2.abort();
    await expect(
      r0.read(stream2, 128, {abortSignal: ac2.signal})
    ).rejects.toThrow("aborted");

    const stream3 = new Readable({
      read() {}
    });
    const ac3 = new AbortController();
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i > 10) {
        stream3.push(null);
        clearInterval(t);
      }
      else {
        stream3.push(new Uint8Array(64));
      }
    }, 2);
    const bytes3 = await r0.read(stream3, undefined, {abortSignal: ac3.signal});
    expect(bytes3.byteLength).toBe(640);

    const stream4 = new Readable({
      read() {}
    });
    const ac4 = new AbortController();
    let i2 = 0;
    const t2 = setInterval(() => {
      i2++;
      if (i2 > 10) {
        ac4.abort();
        clearInterval(t2);
      }
      else {
        stream4.push(new Uint8Array(64));
      }
    }, 2);
    await expect(
      r0.read(stream4, undefined, {abortSignal: ac4.signal})
    ).rejects.toThrow("aborted");

    // acceptSizeMismatch
    const stream5 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes5 = await r0.read(stream5, 64, { acceptSizeMismatch:true, });
    expect(bytes5.byteLength).toBe(128);
    //expect(bytes5.buffer.byteLength).toBe(10485824);

    const stream6 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes6 = await r0.read(stream6, 256, { acceptSizeMismatch:true, });
    expect(bytes6.byteLength).toBe(128);
    expect(bytes6.buffer.byteLength).toBe(256);


  });

});
