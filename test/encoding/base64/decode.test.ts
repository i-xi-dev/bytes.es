import { Base64Encoding } from "../../../src/encoding/base64";
import crypto from "crypto";
import "../../_modules";

describe("Base64Encoding.prototype.decode", (): void => {
  test("decode(string)", (): void => {
    const i1 = new Base64Encoding();
    const decoded11 = i1.decode("");
    expect(JSON.stringify([...decoded11])).toBe("[]");
    const decoded12 = i1.decode("AwIBAP/+/fw=");
    expect(JSON.stringify([...decoded12])).toBe("[3,2,1,0,255,254,253,252]");

    const i2 = new Base64Encoding({_62ndChar:"-", _63rdChar:"_"});
    const decoded22 = i2.decode("AwIBAP_-_fw=");
    expect(JSON.stringify([...decoded22])).toBe("[3,2,1,0,255,254,253,252]");

    const i3 = new Base64Encoding({usePadding:false});
    const decoded32 = i3.decode("AwIBAP/+/fw");
    expect(JSON.stringify([...decoded32])).toBe("[3,2,1,0,255,254,253,252]");

    const i4 = new Base64Encoding({_62ndChar:"-", _63rdChar:"_", usePadding:false});
    const decoded42 = i4.decode("AwIBAP_-_fw");
    expect(JSON.stringify([...decoded42])).toBe("[3,2,1,0,255,254,253,252]");

    expect(Buffer.from("AwIBAP/+/fw=", "base64").toJSON().data.join(",")).toBe("3,2,1,0,255,254,253,252");

    const webcrypto = crypto.webcrypto as Crypto;
    const r1 = webcrypto.getRandomValues(new Uint8Array(256));
    expect(Array.from(i1.decode(Buffer.from(r1).toString('base64'))).join(",")).toBe(Array.from(r1).join(","));

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
