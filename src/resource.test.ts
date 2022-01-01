import assert from "node:assert";
import { Resource } from "./resource";

describe("Resource.prototype.mediaType", () => {
  it("mediaType", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

  });

});

describe("Resource.prototype.data", () => {
  it("data", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    const b11v = b11.data.view;
    assert.strictEqual(b11v[0], 255);
    assert.strictEqual(b11v[1], 0);
    assert.strictEqual(b11v[2], 1);
    assert.strictEqual(b11v[3], 127);

  });

});

describe("Resource.prototype.size", () => {
  it("size", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    assert.strictEqual(b11.size, 4);

  });

});

// describe("Resource.fromDataURL", () => {
//   it("fromDataURL(string)", async () => {

//     const b0 = Resource.fromDataURL("data:text/plain,");
//     assert.strictEqual(b0.size, 0);
//     assert.strictEqual(b0.mediaType.toString(), "text/plain");

//     const b0b = Resource.fromDataURL("data:text/plain;base64,");
//     assert.strictEqual(b0b.size, 0);
//     assert.strictEqual(b0b.mediaType.toString(), "text/plain");

//     const b0c = Resource.fromDataURL("data: ,");
//     assert.strictEqual(b0c.size, 0);
//     assert.strictEqual(b0c.mediaType.toString(), "text/plain;charset=US-ASCII");

//     const b0d = Resource.fromDataURL("data: ; ,");
//     assert.strictEqual(b0d.size, 0);
//     assert.strictEqual(b0d.mediaType.toString(), "text/plain");

//     const b0e = Resource.fromDataURL("data: ; x=y ,");
//     assert.strictEqual(b0e.size, 0);
//     assert.strictEqual(b0e.mediaType.toString(), "text/plain;x=y");

//     const b11 = Resource.fromDataURL("data:text/plain,a1");
//     const b11v = b11.data.view;
//     assert.strictEqual(b11v[0], 97);
//     assert.strictEqual(b11v[1], 49);
//     assert.strictEqual(b11.size, 2);
//     assert.strictEqual(b11.mediaType.toString(), "text/plain");

//     const b12 = Resource.fromDataURL("data:application/octet-stream;base64,AwIBAP/+/fw=");
//     const b12v = b12.data.view;
//     assert.strictEqual(b12v[0], 3);
//     assert.strictEqual(b12v[1], 2);
//     assert.strictEqual(b12v[2], 1);
//     assert.strictEqual(b12v[3], 0);
//     assert.strictEqual(b12v[4], 255);
//     assert.strictEqual(b12v[5], 254);
//     assert.strictEqual(b12v[6], 253);
//     assert.strictEqual(b12v[7], 252);
//     assert.strictEqual(b12.size, 8);
//     assert.strictEqual(b12.mediaType.toString(), "application/octet-stream");

//     const b21 = Resource.fromDataURL("data:text/plain; p1=a,a1");
//     const b21v = b21.data.view;
//     assert.strictEqual(b21v[0], 97);
//     assert.strictEqual(b21v[1], 49);
//     assert.strictEqual(b21.size, 2);
//     assert.strictEqual(b21.mediaType.toString(), "text/plain;p1=a");

//     const b22 = Resource.fromDataURL("data:text/plain; p1=a;p2=\"b,c\",a1");
//     const b22v = b22.data.view;
//     assert.strictEqual(b22v[0], 99);
//     assert.strictEqual(b22v[1], 34);
//     assert.strictEqual(b22v[2], 44);
//     assert.strictEqual(b22v[3], 97);
//     assert.strictEqual(b22v[4], 49);
//     assert.strictEqual(b22.size, 5);
//     assert.strictEqual(b22.mediaType.toString(), "text/plain;p1=a;p2=b");

//     const b31 = Resource.fromDataURL("data:text/plain,%FF%");
//     const b31v = b31.data.view;
//     assert.strictEqual(b31v[0], 255);
//     assert.strictEqual(b31v[1], 0x25);
//     assert.strictEqual(b31.size, 2);
//     assert.strictEqual(b31.mediaType.toString(), "text/plain");

//     const b32 = Resource.fromDataURL("data:text/plain,%fff");
//     const b32v = b32.data.view;
//     assert.strictEqual(b32v[0], 255);
//     assert.strictEqual(b32v[1], 0x66);
//     assert.strictEqual(b32.size, 2);
//     assert.strictEqual(b32.mediaType.toString(), "text/plain");

//     const b33 = Resource.fromDataURL("data:text/plain,a?a=2");
//     const b33v = b33.data.view;
//     assert.strictEqual(b33v[0], 0x61);
//     assert.strictEqual(b33v[1], 0x3F);
//     assert.strictEqual(b33v[2], 0x61);
//     assert.strictEqual(b33v[3], 0x3D);
//     assert.strictEqual(b33v[4], 0x32);
//     assert.strictEqual(b33.size, 5);
//     assert.strictEqual(b33.mediaType.toString(), "text/plain");

//     assert.throws(() => {
//       Resource.fromDataURL("data:text/plain");
//     }, {
//       message: "U+002C not found"
//     });

//     assert.throws(() => {
//       Resource.fromDataURL("data2:text/plain");
//     }, {
//       message: `URL scheme is not "data"`
//     });

//     assert.throws(() => {
//       Resource.fromDataURL("");
//     }, {
//       message: "dataUrl parse error"
//     });

//   });

//   it("fromDataURL(URL)", async () => {
//     const b11 = Resource.fromDataURL(new URL("data:text/plain,a1"));
//     const b11v = b11.data.view;
//     assert.strictEqual(b11v[0], 97);
//     assert.strictEqual(b11v[1], 49);
//     assert.strictEqual(b11.size, 2);
//     assert.strictEqual(b11.mediaType.toString(), "text/plain");

//   });

// });

// describe("Resource.prototype.toDataURL", () => {
//   it("toDataURL()", async () => {
//     const b1 = new Blob([ Uint8Array.of(65,0,1,127) ], { type: "text/plain" });
//     const b11 = await Resource.fromBlob(b1);
//     const b11b = b11.toDataURL();

//     assert.strictEqual(b11b.toString(), "data:text/plain;base64,QQABfw==");
//   });

// });

// describe("Resource.prototype.toSha256Integrity", () => {
//   it("toSha256Integrity()", async () => {
//     const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

//     const b11 = await Resource.fromBlob(b1);
//     const i11a = await b11.toSha256Integrity();
//     assert.strictEqual(i11a, "sha256-IIm8EKKH9DeP2uG3Kn/lD4bbs5lgbsIi/L8hAswrj/w=");

//   });

// });

// describe("Resource.prototype.toSha384Integrity", () => {
//   it("toSha384Integrity()", async () => {
//     const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

//     const b11 = await Resource.fromBlob(b1);
//     const i11b = await b11.toSha384Integrity();
//     assert.strictEqual(i11b, "sha384-0uhOVMndkWKKHtfDkQSsXCcT4r7Xr5Q2bcQ/uczTl2WivQ5094ZFIZZut1y32IsF");

//   });

// });

describe("Resource.prototype.toSha512Integrity", () => {
  it("toSha512Integrity()", async () => {
    const b1 = new Blob([ `*{color:red}` ], { type: "text/css" });

    const b11 = await Resource.fromBlob(b1);
    const i11c = await b11.toSha512Integrity();
    assert.strictEqual(i11c, "sha512-lphfU9I644pv1b+t8yZp7b+kg+lFD+WcIeTqhWieCTRZJ4wWOxTAJxSk9rWrOmVb+TFJ2HfaKIBRFqQ0OOxyAw==");

  });

});

//TODO fromHttpMessage
