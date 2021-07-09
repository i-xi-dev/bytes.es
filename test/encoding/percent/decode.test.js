import { PercentEncoding } from "../../../dist/encoding/percent.js";

describe("PercentEncoding.prototype.decode", () => {
  test("decode(string)", () => {
    const utf8 = new TextEncoder();
    const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    const i1 = new PercentEncoding();
    const decoded11 = i1.decode("");
    expect(JSON.stringify([...decoded11])).toBe("[]");
    const decoded12 = i1.decode("%03%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded12])).toBe("[3,2,1,0,255,254,253,252]");
    const decoded13 = i1.decode("1%00 !~%7F%E3%81%82+");
    expect(JSON.stringify([...decoded13])).toBe(JSON.stringify([...utf8Bytes1]));

    const i2 = new PercentEncoding({inclusions:[32]});
    const decoded21 = i2.decode("%03%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded21])).toBe("[3,2,1,0,255,254,253,252]");
    const decoded22 = i2.decode("%03%20%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded22])).toBe("[3,32,2,1,0,255,254,253,252]");
    const decoded23 = i2.decode("1%00%20!~%7F%E3%81%82+");
    expect(JSON.stringify([...decoded23])).toBe(JSON.stringify([...utf8Bytes1]));

    const i3 = new PercentEncoding({inclusions:[32,0x2B],spaceAsPlus:true});
    const decoded31 = i3.decode("%03+%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded31])).toBe("[3,32,2,1,0,255,254,253,252]");
    const decoded32 = i3.decode("%03+%02%01%00%FF%FE%FD%2B%FC");
    expect(JSON.stringify([...decoded32])).toBe("[3,32,2,1,0,255,254,253,43,252]");
    const decoded33 = i3.decode("1%00+!~%7F%E3%81%82%2B");
    expect(JSON.stringify([...decoded33])).toBe(JSON.stringify([...utf8Bytes1]));

    const i4 = new PercentEncoding({inclusions:[32,0x2B]});
    const decoded41 = i4.decode("%03%20%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded41])).toBe("[3,32,2,1,0,255,254,253,252]");
    const decoded42 = i4.decode("%03%20%02%01%00%FF%FE%FD%2B%FC");
    expect(JSON.stringify([...decoded42])).toBe("[3,32,2,1,0,255,254,253,43,252]");
    const decoded43 = i3.decode(globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"));
    expect(JSON.stringify([...decoded43])).toBe(JSON.stringify([...utf8Bytes1]));

    const i5 = new PercentEncoding({strict:false});
    const decoded51 = i5.decode("");
    expect(JSON.stringify([...decoded51])).toBe("[]");
    const decoded52 = i5.decode("%03%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded52])).toBe("[3,2,1,0,255,254,253,252]");
    const decoded53 = i5.decode("1%00 !~%7F%E3%81%82+");
    expect(JSON.stringify([...decoded53])).toBe(JSON.stringify([...utf8Bytes1]));

    const decoded52b = i5.decode("%03%02%01%00%FF%FE%FD%FC%20%41");
    expect(JSON.stringify([...decoded52b])).toBe("[3,2,1,0,255,254,253,252,32,65]");

    expect(() => {
      i1.decode("あ");
    }).toThrow("decode error (1)");

    expect(() => {
      i1.decode("%%65A");
    }).toThrow("decode error (2)");

    expect(() => {
      i1.decode("%41");
    }).toThrow("decode error (3)");

  });

});
