import { Percent } from "../../../../../dist/data/byte/index.js";

describe("Percent.decode", () => {
  test("decode(string)", () => {
    const utf8 = new TextEncoder();
    const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    const decoded11 = Percent.decode("");
    expect(JSON.stringify([...decoded11])).toBe("[]");
    const decoded12 = Percent.decode("%03%02%01%00%FF%FE%FD%FC");
    expect(JSON.stringify([...decoded12])).toBe("[3,2,1,0,255,254,253,252]");
    const decoded13 = Percent.decode("1%00 !~%7F%E3%81%82+");
    expect(JSON.stringify([...decoded13])).toBe(JSON.stringify([...utf8Bytes1]));

    const decoded21 = Percent.decode("%03%02%01%00%FF%FE%FD%FC", {inclusions:[32]});
    expect(JSON.stringify([...decoded21])).toBe("[3,2,1,0,255,254,253,252]");
    const decoded22 = Percent.decode("%03%20%02%01%00%FF%FE%FD%FC", {inclusions:[32]});
    expect(JSON.stringify([...decoded22])).toBe("[3,32,2,1,0,255,254,253,252]");
    const decoded23 = Percent.decode("1%00%20!~%7F%E3%81%82+", {inclusions:[32]});
    expect(JSON.stringify([...decoded23])).toBe(JSON.stringify([...utf8Bytes1]));

    const decoded31 = Percent.decode("%03+%02%01%00%FF%FE%FD%FC", {inclusions:[32,0x2B],spaceAsPlus:true});
    expect(JSON.stringify([...decoded31])).toBe("[3,32,2,1,0,255,254,253,252]");
    const decoded32 = Percent.decode("%03+%02%01%00%FF%FE%FD%2B%FC", {inclusions:[32,0x2B],spaceAsPlus:true});
    expect(JSON.stringify([...decoded32])).toBe("[3,32,2,1,0,255,254,253,43,252]");
    const decoded33 = Percent.decode("1%00+!~%7F%E3%81%82%2B", {inclusions:[32,0x2B],spaceAsPlus:true});
    expect(JSON.stringify([...decoded33])).toBe(JSON.stringify([...utf8Bytes1]));

    const decoded41 = Percent.decode("%03%20%02%01%00%FF%FE%FD%FC", {inclusions:[32,0x2B]});
    expect(JSON.stringify([...decoded41])).toBe("[3,32,2,1,0,255,254,253,252]");
    const decoded42 = Percent.decode("%03%20%02%01%00%FF%FE%FD%2B%FC", {inclusions:[32,0x2B]});
    expect(JSON.stringify([...decoded42])).toBe("[3,32,2,1,0,255,254,253,43,252]");
    const decoded43 = Percent.decode(globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"), {inclusions:[32,0x2B]});
    expect(JSON.stringify([...decoded43])).toBe(JSON.stringify([...utf8Bytes1]));

    const decoded51 = Percent.decode("", {strict:false});
    expect(JSON.stringify([...decoded51])).toBe("[]");
    const decoded52 = Percent.decode("%03%02%01%00%FF%FE%FD%FC", {strict:false});
    expect(JSON.stringify([...decoded52])).toBe("[3,2,1,0,255,254,253,252]");
    const decoded53 = Percent.decode("1%00 !~%7F%E3%81%82+", {strict:false});
    expect(JSON.stringify([...decoded53])).toBe(JSON.stringify([...utf8Bytes1]));

    const decoded52b = Percent.decode("%03%02%01%00%FF%FE%FD%FC%20%41", {strict:false});
    expect(JSON.stringify([...decoded52b])).toBe("[3,2,1,0,255,254,253,252,32,65]");

    expect(() => {
      Percent.decode("あ");
    }).toThrow("decode error (1)");

    expect(() => {
      Percent.decode("%%65A");
    }).toThrow("decode error (2)");

    expect(() => {
      Percent.decode("%41");
    }).toThrow("decode error (3)");

  });

});
