import { ByteStreamReader } from "../../../dist/byte/index.js";

describe("ByteStreamReader", () => {
  test("ByteStreamReader()", () => {
    const i0 = new ByteStreamReader();
    expect(i0 instanceof ByteStreamReader).toBe(true);
  });

});
