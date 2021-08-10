import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.type", () => {
  test("type", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.type).toBe("text");

  });

});
