import { FileLike } from "../../../dist/media/file_like.js";

describe("FileLike.fromDataUrl", () => {
  test("fromDataUrl(string)", async () => {

    const b0 = FileLike.fromDataUrl("data:text/plain,");
    expect(b0.size).toBe(0);
    expect(b0.mediaType.toString()).toBe("text/plain");

    const b0b = FileLike.fromDataUrl("data:text/plain;base64,");
    expect(b0b.size).toBe(0);
    expect(b0b.mediaType.toString()).toBe("text/plain");

    const b0c = FileLike.fromDataUrl("data: ,");
    expect(b0c.size).toBe(0);
    expect(b0c.mediaType.toString()).toBe("text/plain;charset=US-ASCII");

    const b0d = FileLike.fromDataUrl("data: ; ,");
    expect(b0d.size).toBe(0);
    expect(b0d.mediaType.toString()).toBe("text/plain");

    const b0e = FileLike.fromDataUrl("data: ; x=y ,");
    expect(b0e.size).toBe(0);
    expect(b0e.mediaType.toString()).toBe("text/plain;x=y");

    const b11 = FileLike.fromDataUrl("data:text/plain,a1");
    const b11v = b11.bytes.view();
    expect(b11v[0]).toBe(97);
    expect(b11v[1]).toBe(49);
    expect(b11.size).toBe(2);
    expect(b11.mediaType.toString()).toBe("text/plain");

    const b12 = FileLike.fromDataUrl("data:application/octet-stream;base64,AwIBAP/+/fw=");
    const b12v = b12.bytes.view();
    expect(b12v[0]).toBe(3);
    expect(b12v[1]).toBe(2);
    expect(b12v[2]).toBe(1);
    expect(b12v[3]).toBe(0);
    expect(b12v[4]).toBe(255);
    expect(b12v[5]).toBe(254);
    expect(b12v[6]).toBe(253);
    expect(b12v[7]).toBe(252);
    expect(b12.size).toBe(8);
    expect(b12.mediaType.toString()).toBe("application/octet-stream");

    const b21 = FileLike.fromDataUrl("data:text/plain; p1=a,a1");
    const b21v = b21.bytes.view();
    expect(b21v[0]).toBe(97);
    expect(b21v[1]).toBe(49);
    expect(b21.size).toBe(2);
    expect(b21.mediaType.toString()).toBe("text/plain;p1=a");

    const b22 = FileLike.fromDataUrl("data:text/plain; p1=a;p2=\"b,c\",a1");
    const b22v = b22.bytes.view();
    expect(b22v[0]).toBe(99);
    expect(b22v[1]).toBe(34);
    expect(b22v[2]).toBe(44);
    expect(b22v[3]).toBe(97);
    expect(b22v[4]).toBe(49);
    expect(b22.size).toBe(5);
    expect(b22.mediaType.toString()).toBe("text/plain;p1=a;p2=b");

    const b31 = FileLike.fromDataUrl("data:text/plain,%FF%");
    const b31v = b31.bytes.view();
    expect(b31v[0]).toBe(255);
    expect(b31v[1]).toBe(0x25);
    expect(b31.size).toBe(2);
    expect(b31.mediaType.toString()).toBe("text/plain");

    const b32 = FileLike.fromDataUrl("data:text/plain,%fff");
    const b32v = b32.bytes.view();
    expect(b32v[0]).toBe(255);
    expect(b32v[1]).toBe(0x66);
    expect(b32.size).toBe(2);
    expect(b32.mediaType.toString()).toBe("text/plain");

  });

});
