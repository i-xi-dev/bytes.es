import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toBase64", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);

  it("toBase64()", () => {
    const s1 = bs0.toBase64();
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toBase64();
    assert.strictEqual(s11, "AwIBAP/+/fw=");

  });

  it("toBase64(Base64Options)", () => {
    const s1 = bs0.toBase64({});
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toBase64({});
    assert.strictEqual(s11, "AwIBAP/+/fw=");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const s11b = bs1.toBase64({table:rfc4648urlTable});
    assert.strictEqual(s11b, "AwIBAP_-_fw=");

    const s11c = bs1.toBase64({padEnd:false});
    assert.strictEqual(s11c, "AwIBAP/+/fw");

  });

});
