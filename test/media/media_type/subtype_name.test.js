import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.subtype", () => {
  test("subtype", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.subtype).toBe("plain");

    const i0b = MediaType.fromString("text/PLAIN");
    expect(i0b.subtype).toBe("plain");

  });

});
