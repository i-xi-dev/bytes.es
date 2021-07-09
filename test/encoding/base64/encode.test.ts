import { Byte } from "../../../src/index";
import crypto from "crypto";

describe("Base64Encoding.prototype.encode", (): void => {
  test("encode(Uint8Array)", (): void => {
    const i1 = Byte.Encoding.for("base64");
    expect(i1.encode(Uint8Array.of())).toBe("");
    expect(i1.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw=");

    const i2 = Byte.Encoding.for("base64", {_62ndChar:"-", _63rdChar:"_"});
    expect(i2.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP_-_fw=");

    const i3 = Byte.Encoding.for("base64", {usePadding:false});
    expect(i3.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw");

    const i4 = Byte.Encoding.for("base64", {_62ndChar:"-", _63rdChar:"_", usePadding:false});
    expect(i4.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP_-_fw");

    const webcrypto = (crypto.webcrypto as unknown) as Crypto;
    const r1 = webcrypto.getRandomValues(new Uint8Array(256));
    const r2 = webcrypto.getRandomValues(new Uint8Array(255));
    const r3 = webcrypto.getRandomValues(new Uint8Array(254));
    const r4 = webcrypto.getRandomValues(new Uint8Array(253));
    const r5 = webcrypto.getRandomValues(new Uint8Array(252));

    expect(i1.encode(r1)).toBe(Buffer.from(r1.buffer).toString("base64"));
    expect(i1.encode(r2)).toBe(Buffer.from(r2.buffer).toString("base64"));
    expect(i1.encode(r3)).toBe(Buffer.from(r3.buffer).toString("base64"));
    expect(i1.encode(r4)).toBe(Buffer.from(r4.buffer).toString("base64"));
    expect(i1.encode(r5)).toBe(Buffer.from(r5.buffer).toString("base64"));

    expect(i3.encode(r1)).toBe(Buffer.from(r1.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r2)).toBe(Buffer.from(r2.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r3)).toBe(Buffer.from(r3.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r4)).toBe(Buffer.from(r4.buffer).toString("base64").replace(/=*$/, ""));
    expect(i3.encode(r5)).toBe(Buffer.from(r5.buffer).toString("base64").replace(/=*$/, ""));

  });

});
