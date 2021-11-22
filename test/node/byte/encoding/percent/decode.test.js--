import assert from "node:assert";
import { Percent } from "../../../../../dist/byte/index.js";

describe("Percent.decode", () => {
  it("decode(string)", () => {
    const utf8 = new TextEncoder();
    const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    const decoded11 = Percent.decode("");
    assert.strictEqual(JSON.stringify([...decoded11]), "[]");
    const decoded12 = Percent.decode("%03%02%01%00%FF%FE%FD%FC");
    assert.strictEqual(JSON.stringify([...decoded12]), "[3,2,1,0,255,254,253,252]");
    const decoded13 = Percent.decode("1%00 !~%7F%E3%81%82+");
    assert.strictEqual(JSON.stringify([...decoded13]), JSON.stringify([...utf8Bytes1]));

    const decoded21 = Percent.decode("%03%02%01%00%FF%FE%FD%FC");
    assert.strictEqual(JSON.stringify([...decoded21]), "[3,2,1,0,255,254,253,252]");
    const decoded22 = Percent.decode("%03%20%02%01%00%FF%FE%FD%FC");
    assert.strictEqual(JSON.stringify([...decoded22]), "[3,32,2,1,0,255,254,253,252]");
    const decoded23 = Percent.decode("1%00%20!~%7F%E3%81%82+");
    assert.strictEqual(JSON.stringify([...decoded23]), JSON.stringify([...utf8Bytes1]));

    const decoded31 = Percent.decode("%03+%02%01%00%FF%FE%FD%FC", {spaceAsPlus:true});
    assert.strictEqual(JSON.stringify([...decoded31]), "[3,32,2,1,0,255,254,253,252]");
    const decoded32 = Percent.decode("%03+%02%01%00%FF%FE%FD%2B%FC", {spaceAsPlus:true});
    assert.strictEqual(JSON.stringify([...decoded32]), "[3,32,2,1,0,255,254,253,43,252]");
    const decoded33 = Percent.decode("1%00+!~%7F%E3%81%82%2B", {spaceAsPlus:true});
    assert.strictEqual(JSON.stringify([...decoded33]), JSON.stringify([...utf8Bytes1]));

    const decoded41 = Percent.decode("%03%20%02%01%00%FF%FE%FD%FC");
    assert.strictEqual(JSON.stringify([...decoded41]), "[3,32,2,1,0,255,254,253,252]");
    const decoded42 = Percent.decode("%03%20%02%01%00%FF%FE%FD%2B%FC");
    assert.strictEqual(JSON.stringify([...decoded42]), "[3,32,2,1,0,255,254,253,43,252]");
    const decoded43 = Percent.decode(globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"));
    assert.strictEqual(JSON.stringify([...decoded43]), JSON.stringify([...utf8Bytes1]));

    const decoded52b = Percent.decode("%03%02%01%00%FF%FE%FD%FC%20%41");
    assert.strictEqual(JSON.stringify([...decoded52b]), "[3,2,1,0,255,254,253,252,32,65]");

    assert.throws(() => {
      Percent.decode("あ");
    }, {
      message: "decode error (1)"
    });

    const decoded55 = Percent.decode("%%65A");
    assert.strictEqual(JSON.stringify([...decoded55]), "[37,101,65]");

    const decoded56 = Percent.decode("%41");
    assert.strictEqual(JSON.stringify([...decoded56]), "[65]");

    const decoded57 = Percent.decode("%ff");
    assert.strictEqual(JSON.stringify([...decoded57]), "[255]");

    const decoded57b = Percent.decode("%FF");
    assert.strictEqual(JSON.stringify([...decoded57b]), "[255]");

    const decoded57c = Percent.decode("%f");
    assert.strictEqual(JSON.stringify([...decoded57c]), "[37,102]");

    const decoded57d = Percent.decode("%fff");
    assert.strictEqual(JSON.stringify([...decoded57d]), "[255,102]");

  });

});
