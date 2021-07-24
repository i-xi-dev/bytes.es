import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.originalString", () => {
  test("originalString", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.originalString).toBe("text/plain");

    const i0b = MediaType.fromString("text/plain ");
    expect(i0b.originalString).toBe("text/plain");

    const i0c = MediaType.fromString("text/plain; charset=Utf-8");
    expect(i0c.originalString).toBe("text/plain; charset=Utf-8");

  });

});
