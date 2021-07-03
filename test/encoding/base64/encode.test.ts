import { Base64Encoding } from "../../../src/encoding/base64";
import crypto from "crypto";
import "../../_modules";

describe("Base64Encoding.prototype.encode", (): void => {
  test("encode(Uint8Array)", (): void => {
    const i1 = new Base64Encoding();
    expect(i1.encode(Uint8Array.of())).toBe("");
    expect(i1.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw=");

    const i2 = new Base64Encoding({_62ndChar:"-", _63rdChar:"_"});
    expect(i2.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP_-_fw=");

    const i3 = new Base64Encoding({usePadding:false});
    expect(i3.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP/+/fw");

    const i4 = new Base64Encoding({_62ndChar:"-", _63rdChar:"_", usePadding:false});
    expect(i4.encode(Uint8Array.of(3,2,1,0,255,254,253,252))).toBe("AwIBAP_-_fw");

    const webcrypto = crypto.webcrypto as Crypto;
    const r1 = webcrypto.getRandomValues(new Uint8Array(256));

    expect(i1.encode(r1)).toBe(Buffer.from(r1.buffer).toString("base64"));

  });

});
