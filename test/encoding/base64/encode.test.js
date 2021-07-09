import { Byte } from "../../../dist/index.js";

describe("Base64Encoding.prototype.encode", () => {
  test("encode(Uint8Array)", () => {
    const i1 = Byte.Encoding.for("base64");
    expect(i1.encode(Uint8Array.of())).toBe("");
    expect(i1.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw=");

    const i2 = Byte.Encoding.for("base64", {_62ndChar:"-", _63rdChar:"_"});
    expect(i2.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP_-_fw=");

    const i3 = Byte.Encoding.for("base64", {usePadding:false});
    expect(i3.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw");

    const i4 = Byte.Encoding.for("base64", {_62ndChar:"-", _63rdChar:"_", usePadding:false});
    expect(i4.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP_-_fw");

    const r1 = crypto.getRandomValues(new Uint8Array(256));
    const r2 = crypto.getRandomValues(new Uint8Array(255));
    const r3 = crypto.getRandomValues(new Uint8Array(254));
    const r4 = crypto.getRandomValues(new Uint8Array(253));
    const r5 = crypto.getRandomValues(new Uint8Array(252));
    const r6 = crypto.getRandomValues(new Uint8Array(251));
    const r7 = crypto.getRandomValues(new Uint8Array(250));
    const r8 = crypto.getRandomValues(new Uint8Array(249));
    const r9 = crypto.getRandomValues(new Uint8Array(248));

    expect(i1.encode(r1)).toBe(Buffer.from(r1.buffer).toString("base64"));
    expect(i1.encode(r2)).toBe(Buffer.from(r2.buffer).toString("base64"));
    expect(i1.encode(r3)).toBe(Buffer.from(r3.buffer).toString("base64"));
    expect(i1.encode(r4)).toBe(Buffer.from(r4.buffer).toString("base64"));
    expect(i1.encode(r5)).toBe(Buffer.from(r5.buffer).toString("base64"));
    expect(i1.encode(r6)).toBe(Buffer.from(r6.buffer).toString("base64"));
    expect(i1.encode(r7)).toBe(Buffer.from(r7.buffer).toString("base64"));
    expect(i1.encode(r8)).toBe(Buffer.from(r8.buffer).toString("base64"));
    expect(i1.encode(r9)).toBe(Buffer.from(r9.buffer).toString("base64"));

    expect(i3.encode(r1)).toBe(Buffer.from(r1.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r2)).toBe(Buffer.from(r2.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r3)).toBe(Buffer.from(r3.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r4)).toBe(Buffer.from(r4.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r5)).toBe(Buffer.from(r5.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r6)).toBe(Buffer.from(r6.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r7)).toBe(Buffer.from(r7.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r8)).toBe(Buffer.from(r8.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r9)).toBe(Buffer.from(r9.buffer).toString("base64").replace(/=*$/, ""));

  });

});
