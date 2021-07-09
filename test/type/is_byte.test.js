import { isByte } from "../../dist/type.js";

describe("Type.isByte", () => {
  test("isByte(number)", () => {
    expect(isByte(-1)).toBe(false);
    expect(isByte(-0)).toBe(true);
    expect(isByte(0)).toBe(true);

    expect(isByte(255)).toBe(true);
    expect(isByte(256)).toBe(false);

    expect(isByte(1.1)).toBe(false);
  });

  test("isByte(*)", () => {
    expect(isByte("")).toBe(false);
    expect(isByte("0")).toBe(false);
    expect(isByte([])).toBe(false);
    expect(isByte({})).toBe(false);
    expect(isByte(null)).toBe(false);
  });
});
