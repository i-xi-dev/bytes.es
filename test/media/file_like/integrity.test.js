import assert from "node:assert";
import { Blob } from "node:buffer";
import { FileLike } from "../../../dist/media/file_like.js";

describe("FileLike.prototype.integrity", () => {
  it("integrity(string)", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const b11 = await FileLike.fromBlob(b1);
    const i11a = await b11.integrity("SHA-256");
    assert.strictEqual(i11a, "sha256-IIm8EKKH9DeP2uG3Kn/lD4bbs5lgbsIi/L8hAswrj/w=");

    const i11b = await b11.integrity("SHA-384");
    assert.strictEqual(i11b, "sha384-0uhOVMndkWKKHtfDkQSsXCcT4r7Xr5Q2bcQ/uczTl2WivQ5094ZFIZZut1y32IsF");

    const i11c = await b11.integrity("SHA-512");
    assert.strictEqual(i11c, "sha512-lphfU9I644pv1b+t8yZp7b+kg+lFD+WcIeTqhWieCTRZJ4wWOxTAJxSk9rWrOmVb+TFJ2HfaKIBRFqQ0OOxyAw==");

  });

});
