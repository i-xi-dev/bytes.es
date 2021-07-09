import { Byte } from "../../../src/index";
import crypto from "crypto";

describe("Base64Encoding.prototype.decode", (): void => {
  test("decode(string)", (): void => {
    const i1 = Byte.Encoding.for("base64");
    const decoded11 = i1.decode("");
    expect(JSON.stringify([...decoded11])).toBe("[]");
    const decoded12 = i1.decode("AwIBAP/+/fw=");
    expect(JSON.stringify([...decoded12])).toBe("[3,2,1,0,255,254,253,252]");

    const i2 = Byte.Encoding.for("base64", {_62ndChar:"-", _63rdChar:"_"});
    const decoded22 = i2.decode("AwIBAP_-_fw=");
    expect(JSON.stringify([...decoded22])).toBe("[3,2,1,0,255,254,253,252]");

    const i3 = Byte.Encoding.for("base64", {usePadding:false});
    const decoded32 = i3.decode("AwIBAP/+/fw");
    expect(JSON.stringify([...decoded32])).toBe("[3,2,1,0,255,254,253,252]");

    const i4 = Byte.Encoding.for("base64", {_62ndChar:"-", _63rdChar:"_", usePadding:false});
    const decoded42 = i4.decode("AwIBAP_-_fw");
    expect(JSON.stringify([...decoded42])).toBe("[3,2,1,0,255,254,253,252]");

    expect(Buffer.from("AwIBAP/+/fw=", "base64").toJSON().data.join(",")).toBe("3,2,1,0,255,254,253,252");

    const webcrypto = (crypto.webcrypto as unknown) as Crypto;
    const r1 = webcrypto.getRandomValues(new Uint8Array(256));
    const r2 = webcrypto.getRandomValues(new Uint8Array(255));
    const r3 = webcrypto.getRandomValues(new Uint8Array(254));
    const r4 = webcrypto.getRandomValues(new Uint8Array(253));
    const r5 = webcrypto.getRandomValues(new Uint8Array(252));

    expect(Array.from(i1.decode(Buffer.from(r1).toString('base64'))).join(",")).toBe(Array.from(r1).join(","));
    expect(Array.from(i1.decode(Buffer.from(r2).toString('base64'))).join(",")).toBe(Array.from(r2).join(","));
    expect(Array.from(i1.decode(Buffer.from(r3).toString('base64'))).join(",")).toBe(Array.from(r3).join(","));
    expect(Array.from(i1.decode(Buffer.from(r4).toString('base64'))).join(",")).toBe(Array.from(r4).join(","));
    expect(Array.from(i1.decode(Buffer.from(r5).toString('base64'))).join(",")).toBe(Array.from(r5).join(","));

    expect(Array.from(i3.decode(Buffer.from(r1).toString('base64').replace(/=*$/, ""))).join(",")).toBe(Array.from(r1).join(","));
    expect(Array.from(i3.decode(Buffer.from(r2).toString('base64').replace(/=*$/, ""))).join(",")).toBe(Array.from(r2).join(","));
    expect(Array.from(i3.decode(Buffer.from(r3).toString('base64').replace(/=*$/, ""))).join(",")).toBe(Array.from(r3).join(","));
    expect(Array.from(i3.decode(Buffer.from(r4).toString('base64').replace(/=*$/, ""))).join(",")).toBe(Array.from(r4).join(","));
    expect(Array.from(i3.decode(Buffer.from(r5).toString('base64').replace(/=*$/, ""))).join(",")).toBe(Array.from(r5).join(","));

    expect(() => {
      i1.decode("あ");
    }).toThrow("decode error (1)");
    expect(() => {
      i1.decode("AwIBAP_-_fw=");
    }).toThrow("decode error (1)");
    expect(() => {
      i1.decode("AwIBAP/+/fw");
    }).toThrow("decode error (2)");
    expect(() => {
      i1.decode("=AwIBAP/+/fw");
    }).toThrow("decode error (1)");
    expect(() => {
      i1.decode("=");
    }).toThrow("decode error (1)");
    expect(() => {
      i1.decode("AwIBAP/+/fw,");
    }).toThrow("decode error (1)");

    expect(() => {
      i3.decode("AwIBAP/+/fw=");
    }).toThrow("decode error (1)");
  });
});
