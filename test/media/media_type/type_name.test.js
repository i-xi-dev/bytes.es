import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.typeName", () => {
  test("typeName", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.typeName).toBe("text");

  });

});
