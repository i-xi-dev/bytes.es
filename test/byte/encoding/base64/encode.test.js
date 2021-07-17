import { Base64 } from "../../../../dist/byte/index.js";

describe("Base64.encode", () => {
  test("encode(Uint8Array)", () => {
    expect(Base64.encode(Uint8Array.of())).toBe("");
    expect(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw=");
    expect(Base64.encode(Uint8Array.of(255))).toBe("/w==");
    expect(Base64.encode(Uint8Array.of(251))).toBe("+w==");

    expect(Base64.encode(Uint8Array.of(251), {_62ndChar:"-"})).toBe("-w==");

    expect(Base64.encode(Uint8Array.of(255), {_63rdChar:"_"})).toBe("_w==");

    expect(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252), {_62ndChar:"-", _63rdChar:"_"})).toBe("AwIBAP_-_fw=");

    expect(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252), {usePadding:false})).toBe("AwIBAP/+/fw");
    expect(Base64.encode(Uint8Array.of(255), {usePadding:false})).toBe("/w");

    expect(Base64.encode(Uint8Array.of(255), {usePadding:true})).toBe("/w==");

    expect(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252), {_62ndChar:"-", _63rdChar:"_", usePadding:false})).toBe("AwIBAP_-_fw");

    const r1 = crypto.getRandomValues(new Uint8Array(256));
    const r2 = crypto.getRandomValues(new Uint8Array(255));
    const r3 = crypto.getRandomValues(new Uint8Array(254));
    const r4 = crypto.getRandomValues(new Uint8Array(253));
    const r5 = crypto.getRandomValues(new Uint8Array(252));
    const r6 = crypto.getRandomValues(new Uint8Array(251));
    const r7 = crypto.getRandomValues(new Uint8Array(250));
    const r8 = crypto.getRandomValues(new Uint8Array(249));
    const r9 = crypto.getRandomValues(new Uint8Array(248));

    expect(Base64.encode(r1)).toBe(Buffer.from(r1.buffer).toString("base64"));
    expect(Base64.encode(r2)).toBe(Buffer.from(r2.buffer).toString("base64"));
    expect(Base64.encode(r3)).toBe(Buffer.from(r3.buffer).toString("base64"));
    expect(Base64.encode(r4)).toBe(Buffer.from(r4.buffer).toString("base64"));
    expect(Base64.encode(r5)).toBe(Buffer.from(r5.buffer).toString("base64"));
    expect(Base64.encode(r6)).toBe(Buffer.from(r6.buffer).toString("base64"));
    expect(Base64.encode(r7)).toBe(Buffer.from(r7.buffer).toString("base64"));
    expect(Base64.encode(r8)).toBe(Buffer.from(r8.buffer).toString("base64"));
    expect(Base64.encode(r9)).toBe(Buffer.from(r9.buffer).toString("base64"));

    expect(Base64.encode(r1, {usePadding:false})).toBe(Buffer.from(r1.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r2, {usePadding:false})).toBe(Buffer.from(r2.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r3, {usePadding:false})).toBe(Buffer.from(r3.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r4, {usePadding:false})).toBe(Buffer.from(r4.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r5, {usePadding:false})).toBe(Buffer.from(r5.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r6, {usePadding:false})).toBe(Buffer.from(r6.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r7, {usePadding:false})).toBe(Buffer.from(r7.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r8, {usePadding:false})).toBe(Buffer.from(r8.buffer).toString("base64").replace(/=*$/, ""));
    expect(Base64.encode(r9, {usePadding:false})).toBe(Buffer.from(r9.buffer).toString("base64").replace(/=*$/, ""));

  });

});
