import { ByteStreamReader } from "../../../dist/byte/stream_reader.js";
import fs from "fs";

describe("ByteStreamReader.prototype.addEventListener", () => {
  test("addEventListener( )", async () => {

    const stream = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const r0b = new ByteStreamReader();
    let es = [];
    r0b.addEventListener("progress", (e) => {
      es.push({
        loaded: e.loaded,
        total: e.total,
        lengthComputable: e.lengthComputable,
      });
    });
    const bytes = await r0b.read(stream);
    expect(bytes.byteLength).toBe(128);
    let i = 0;
    for (const e of es) {
      i = i + 64;
      expect(e.total).toBe(0);
      expect(e.lengthComputable).toBe(false);
      expect(e.loaded).toBe(i);
    }

    const stream2 = fs.createReadStream("./test/_data/128.txt", { highWaterMark: 64 });
    const r0b2 = new ByteStreamReader();
    let es2 = [];
    r0b2.addEventListener("progress", (e) => {
      es2.push({
        loaded: e.loaded,
        total: e.total,
        lengthComputable: e.lengthComputable,
      });
    });
    const bytes2 = await r0b2.read(stream2, 128);
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
