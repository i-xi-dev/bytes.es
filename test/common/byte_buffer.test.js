import { expect } from '@esm-bundle/chai';
import { ByteBuffer } from "../../dist/index.js";

describe("ByteBuffer", () => {
  it("new ByteBuffer()/capacity/position/put()", () => {
    const b = new ByteBuffer();

    expect(b.capacity).to.equal(1_048_576);
    expect(b.position).to.equal(0);

    b.put(Uint8Array.of(1,2,3,4,5,6,7,8,9,10,11,12));
    expect(b.capacity).to.equal(1_048_576);
    expect(b.position).to.equal(12);

    b.put(Uint8Array.of(1,2,3,4,5,6,7,8,9,10,11,12));
    expect(b.capacity).to.equal(1_048_576);
    expect(b.position).to.equal(24);

  });

  it("new ByteBuffer(number)/capacity/position/put()", () => {
    const b = new ByteBuffer(10);

    expect(b.capacity).to.equal(10);
    expect(b.position).to.equal(0);

    b.put(Uint8Array.of(1,2,3,4,5,6,7,8,9,10,11,12));
    expect(b.capacity).to.equal(10485760);
    expect(b.position).to.equal(12);

    b.put(Uint8Array.of(1,2,3,4,5,6,7,8,9,10,11,12));
    expect(b.capacity).to.equal(10485760);
    expect(b.position).to.equal(24);

    const copy1 = b.subarray();
    expect(copy1.buffer).to.equal(b.subarray().buffer);
    expect(copy1.byteLength).to.equal(24);
    expect(copy1.buffer.byteLength).to.equal(10485760);
    expect([...copy1].map(b => b.toString(10)).join(",")).to.equal("1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12");

    const copy2 = b.slice();
    expect(copy2.buffer).to.not.equal(copy1.buffer);
    expect(copy2.byteLength).to.equal(24);
    expect(copy2.buffer.byteLength).to.equal(24);
    expect([...copy2].map(b => b.toString(10)).join(",")).to.equal("1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12");

  });

});
