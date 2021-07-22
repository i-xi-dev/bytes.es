import { StreamReader } from "../../../../dist/data/byte/index.js";
import fs from "fs";
import { Readable } from "stream";

describe("StreamReader.read", () => {
  test("read(NodeJS.ReadableStream)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bytes0 = await StreamReader.read(stream0);
    expect(bytes0.byteLength).toBe(0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes = await StreamReader.read(stream);
    expect(bytes.byteLength).toBe(128);

  });

  test("read(NodeJS.ReadableStream, number)", async () => {
    const stream0 = fs.createReadStream("./test/_data/0.txt", { highWaterMark: 64 });
    const bytes0 = await StreamReader.read(stream0, 0);
    expect(bytes0.byteLength).toBe(0);
    expect(bytes0.buffer.byteLength).toBe(0);

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes = await StreamReader.read(stream, 128);
    expect(bytes.byteLength).toBe(128);
    expect(bytes.buffer.byteLength).toBe(128);

    // const stream2 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    // const bytes2 = await StreamReader.read(stream2, 256);
    // expect(bytes2.byteLength).toBe(128);
    // expect(bytes2.buffer.byteLength).toBe(256);

    const stream3 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    await expect(
      StreamReader.read(stream3, 64)
    ).rejects.toThrow("Stream size too long");

    const stream4 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    await expect(
      StreamReader.read(stream4, 256)
    ).rejects.toThrow("Stream size too short");

  });

  test("read(NodeJS.ReadableStream, number, StreamReaderOptions) - abortSignal", async () => {
    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const ac = new AbortController();
    const bytes = await StreamReader.read(stream, 128, {abortSignal: ac.signal});
    expect(bytes.byteLength).toBe(128);

    const stream2 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const ac2 = new AbortController();
    ac2.abort();
    await expect(
      StreamReader.read(stream2, 128, {abortSignal: ac2.signal})
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
    const bytes3 = await StreamReader.read(stream3, undefined, {abortSignal: ac3.signal});
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
      StreamReader.read(stream4, undefined, {abortSignal: ac4.signal})
    ).rejects.toThrow("aborted");

  });

  test("read(NodeJS.ReadableStream, number, StreamReaderOptions) - acceptSizeMismatch", async () => {
    const stream5 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes5 = await StreamReader.read(stream5, 64, { acceptSizeMismatch:true, });
    expect(bytes5.byteLength).toBe(128);
    //expect(bytes5.buffer.byteLength).toBe(10485824);

    const stream6 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const bytes6 = await StreamReader.read(stream6, 256, { acceptSizeMismatch:true, });
    expect(bytes6.byteLength).toBe(128);
    expect(bytes6.buffer.byteLength).toBe(256);

  });

  test("read(NodeJS.ReadableStream, number, StreamReaderOptions) - listenerTarget", async () => {

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const et = new EventTarget();
    let es = [];
    et.addEventListener("progress", (e) => {
      es.push({
        loaded: e.loaded,
        total: e.total,
        lengthComputable: e.lengthComputable,
      });
    });
    const bytes = await StreamReader.read(stream, undefined, { listenerTarget: et, });
    expect(bytes.byteLength).toBe(128);
    let i = 0;
    for (const e of es) {
      i = i + 64;
      expect(e.total).toBe(0);
      expect(e.lengthComputable).toBe(false);
      expect(e.loaded).toBe(i);
    }


    const stream2 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const et2 = new EventTarget();
    let es2 = [];
    et2.addEventListener("progress", (e) => {
      es2.push({
        loaded: e.loaded,
        total: e.total,
        lengthComputable: e.lengthComputable,
      });
    });
    const bytes2 = await StreamReader.read(stream2, 128, { listenerTarget: et2, });
    expect(bytes2.byteLength).toBe(128);
    let i2 = 0;
    for (const e of es2) {
      i2 = i2 + 64;
      expect(e.total).toBe(128);
      expect(e.lengthComputable).toBe(true);
      expect(e.loaded).toBe(i2);
    }

  });

});
