import assert from "node:assert";
import { FileLike } from "../../../dist/media/file_like.js";

describe("FileLike.fromDataUrl", () => {
  it("fromDataUrl(string)", async () => {

    const b0 = FileLike.fromDataUrl("data:text/plain,");
    assert.strictEqual(b0.size, 0);
    assert.strictEqual(b0.mediaType.toString(), "text/plain");

    const b0b = FileLike.fromDataUrl("data:text/plain;base64,");
    assert.strictEqual(b0b.size, 0);
    assert.strictEqual(b0b.mediaType.toString(), "text/plain");

    const b0c = FileLike.fromDataUrl("data: ,");
    assert.strictEqual(b0c.size, 0);
    assert.strictEqual(b0c.mediaType.toString(), "text/plain;charset=US-ASCII");

    const b0d = FileLike.fromDataUrl("data: ; ,");
    assert.strictEqual(b0d.size, 0);
    assert.strictEqual(b0d.mediaType.toString(), "text/plain");

    const b0e = FileLike.fromDataUrl("data: ; x=y ,");
    assert.strictEqual(b0e.size, 0);
    assert.strictEqual(b0e.mediaType.toString(), "text/plain;x=y");

    const b11 = FileLike.fromDataUrl("data:text/plain,a1");
    const b11v = b11.bytes.view();
    assert.strictEqual(b11v[0], 97);
    assert.strictEqual(b11v[1], 49);
    assert.strictEqual(b11.size, 2);
    assert.strictEqual(b11.mediaType.toString(), "text/plain");

    const b12 = FileLike.fromDataUrl("data:application/octet-stream;base64,AwIBAP/+/fw=");
    const b12v = b12.bytes.view();
    assert.strictEqual(b12v[0], 3);
    assert.strictEqual(b12v[1], 2);
    assert.strictEqual(b12v[2], 1);
    assert.strictEqual(b12v[3], 0);
    assert.strictEqual(b12v[4], 255);
    assert.strictEqual(b12v[5], 254);
    assert.strictEqual(b12v[6], 253);
    assert.strictEqual(b12v[7], 252);
    assert.strictEqual(b12.size, 8);
    assert.strictEqual(b12.mediaType.toString(), "application/octet-stream");

    const b21 = FileLike.fromDataUrl("data:text/plain; p1=a,a1");
    const b21v = b21.bytes.view();
    assert.strictEqual(b21v[0], 97);
    assert.strictEqual(b21v[1], 49);
    assert.strictEqual(b21.size, 2);
    assert.strictEqual(b21.mediaType.toString(), "text/plain;p1=a");

    const b22 = FileLike.fromDataUrl("data:text/plain; p1=a;p2=\"b,c\",a1");
    const b22v = b22.bytes.view();
    assert.strictEqual(b22v[0], 99);
    assert.strictEqual(b22v[1], 34);
    assert.strictEqual(b22v[2], 44);
    assert.strictEqual(b22v[3], 97);
    assert.strictEqual(b22v[4], 49);
    assert.strictEqual(b22.size, 5);
    assert.strictEqual(b22.mediaType.toString(), "text/plain;p1=a;p2=b");

    const b31 = FileLike.fromDataUrl("data:text/plain,%FF%");
    const b31v = b31.bytes.view();
    assert.strictEqual(b31v[0], 255);
    assert.strictEqual(b31v[1], 0x25);
    assert.strictEqual(b31.size, 2);
    assert.strictEqual(b31.mediaType.toString(), "text/plain");

    const b32 = FileLike.fromDataUrl("data:text/plain,%fff");
    const b32v = b32.bytes.view();
    assert.strictEqual(b32v[0], 255);
    assert.strictEqual(b32v[1], 0x66);
    assert.strictEqual(b32.size, 2);
    assert.strictEqual(b32.mediaType.toString(), "text/plain");

    const b33 = FileLike.fromDataUrl("data:text/plain,a?a=2");
    const b33v = b33.bytes.view();
    assert.strictEqual(b33v[0], 0x61);
    assert.strictEqual(b33v[1], 0x3F);
    assert.strictEqual(b33v[2], 0x61);
    assert.strictEqual(b33v[3], 0x3D);
    assert.strictEqual(b33v[4], 0x32);
    assert.strictEqual(b33.size, 5);
    assert.strictEqual(b33.mediaType.toString(), "text/plain");

  });

});
