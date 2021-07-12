import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toString", () => {
  const bs0 = ByteSequence.create(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  test("toString()", () => {
    expect(bs0.toString()).toBe("");
    expect(bs1.toString()).toBe("413c0a20a9");

  });

});
