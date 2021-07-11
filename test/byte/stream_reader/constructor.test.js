import { ByteStreamReader } from "../../../dist/byte/stream_reader.js";

describe("ByteStreamReader", () => {
  test("ByteStreamReader()", () => {
    const i0 = new ByteStreamReader();
    expect(i0 instanceof ByteStreamReader).toBe(true);
  });

});
