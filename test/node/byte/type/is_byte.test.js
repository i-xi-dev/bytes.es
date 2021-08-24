import assert from "node:assert";
import { isByte } from "../../../../dist/byte/type.js";

describe("Type.isByte", () => {
  it("isByte(number)", () => {
    assert.strictEqual(isByte(-1), false);
    assert.strictEqual(isByte(-0), true);
    assert.strictEqual(isByte(0), true);

    assert.strictEqual(isByte(255), true);
    assert.strictEqual(isByte(256), false);

    assert.strictEqual(isByte(1.1), false);
  });

  it("isByte(*)", () => {
    assert.strictEqual(isByte(""), false);
    assert.strictEqual(isByte("0"), false);
    assert.strictEqual(isByte([]), false);
    assert.strictEqual(isByte({}), false);
    assert.strictEqual(isByte(null), false);
    assert.strictEqual(isByte(), false);
  });
});
