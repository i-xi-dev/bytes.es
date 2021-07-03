import { isByte } from "../../src/type";

describe("Type.isByte", (): void => {
  test("isByte(number)", (): void => {
    expect(isByte(-1)).toBe(false);
    expect(isByte(-0)).toBe(true);
    expect(isByte(0)).toBe(true);

    expect(isByte(255)).toBe(true);
    expect(isByte(256)).toBe(false);

    expect(isByte(1.1)).toBe(false);
  });

  test("isByte(*)", (): void => {
    expect(isByte("")).toBe(false);
    expect(isByte("0")).toBe(false);
    expect(isByte([])).toBe(false);
    expect(isByte({})).toBe(false);
    expect(isByte(null)).toBe(false);
  });
});
