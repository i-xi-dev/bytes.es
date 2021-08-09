import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.essence", () => {
  test("essence", () => {
    const i0 = MediaType.fromString("text/plain;charset=utf-8");
    expect(i0.essence).toBe("text/plain");

  });

});
