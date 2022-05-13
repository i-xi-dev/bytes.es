import { expect } from '@esm-bundle/chai';
import { ByteStream } from "../../dist/index.js";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function createStream(length) {
  let ti;
  return new ReadableStream({
    start(controller) {
      let c = 0;
      ti = setInterval(() => {
        if (c >= length) {
          clearInterval(ti);
          controller.close();
          return;
        }
        c = c + 1;

        let x = Uint8Array.of(255);
        controller.enqueue(x);
      }, 10);
    },
    cancel() {
      clearInterval(ti);
    },
  });
}

describe("ByteStream.Reader", () => {
  it("ByteStream.Reader.prototype.read(ReadableStream)", async () => {
    const s1 = createStream(8);

    const reader1 = new ByteStream.Reader();
    const bs1 = await reader1.read(s1);

    expect(bs1.byteLength).to.equal(8);

    const s2 = createStream(8);
    try {
      await reader1.read(s2);
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("InvalidStateError");
      expect(err.message).to.equal("readyState: 2");
    }
  });

  it("ByteStream.Reader.prototype.read(AsyncIterable<Uint8Array>)", async () => {
    const reader1 = new ByteStream.Reader();
    const ai1 = async function*() {
      yield Uint8Array.of(1);
      yield Uint8Array.of(2,3);
    };
    const bs1 = await reader1.read(ai1());
    expect(bs1.byteLength).to.equal(3);
    
    const reader2 = new ByteStream.Reader();
    const ai2 = async function*() {
      return;
    };
    const bs2 = await reader2.read(ai2());
    expect(bs2.byteLength).to.equal(0);
  });

  it("ByteStream.Reader.prototype.read(AsyncIterable<*>)", async () => {
    const reader1 = new ByteStream.Reader();
    const ai1 = async function*() {
      yield 1;
      yield 2;
    };
    try {
      await reader1.read(ai1());
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("TypeError");
      expect(err.message).to.equal("asyncSource");
    }
  });

  it("ByteStream.Reader.prototype.read(*)", async () => {
    const reader1 = new ByteStream.Reader();
    try {
      await reader1.read(3);
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("TypeError");
      expect(err.message).to.equal("stream");
    }
  });

  it("ByteStream.Reader.prototype.read(Iterable<Uint8Array>)", async () => {
    const reader1 = new ByteStream.Reader();
    const bs1 = await reader1.read([ Uint8Array.of(1), Uint8Array.of(2,3) ]);
    expect(bs1.byteLength).to.equal(3);

    const reader2 = new ByteStream.Reader();
    const bs2 = await reader2.read([]);
    expect(bs2.byteLength).to.equal(0);
  });

  it("ByteStream.Reader.prototype.read(Iterable<*>)", async () => {
    const reader1 = new ByteStream.Reader();
    try {
      await reader1.read([ 3 ]);
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("TypeError");
      expect(err.message).to.equal("asyncSource");
    }
  });

  it("ByteStream.Reader.prototype.read(ReadableStream, {totalByteLength: number})", async () => {
    const s1 = createStream(8);
    const reader1 = new ByteStream.Reader();
    const bs1 = await reader1.read(s1, {totalByteLength: 8});
    expect(bs1.byteLength).to.equal(8);
    expect(bs1.buffer.byteLength).to.equal(8);

    const s2 = createStream(8);
    const reader2 = new ByteStream.Reader();
    const bs2 = await reader2.read(s2, {totalByteLength: 9});
    expect(bs2.byteLength).to.equal(8);
    expect(bs2.buffer.byteLength).to.equal(8);

    const s3 = createStream(8);
    const reader3 = new ByteStream.Reader();
    const bs3 = await reader3.read(s3, {totalByteLength: 7});
    expect(bs3.byteLength).to.equal(8);
    expect(bs3.buffer.byteLength).to.equal(8);

    const s4 = createStream(8);
    const reader4 = new ByteStream.Reader();
    const bs4 = await reader4.read(s4, {totalByteLength: 0});
    expect(bs4.byteLength).to.equal(8);
    expect(bs4.buffer.byteLength).to.equal(8);

    const s5 = createStream(8);
    const reader5 = new ByteStream.Reader();
    const bs5 = await reader5.read(s5, {totalByteLength: undefined});
    expect(bs5.byteLength).to.equal(8);
    expect(bs5.buffer.byteLength).to.equal(8);

  });

  it("ByteStream.Reader.prototype.read(ReadableStream, {totalByteLength:number}) - error", async () => {
    const s1 = createStream(15);
    const reader1 = new ByteStream.Reader();
    try {
      await reader1.read(s1, {totalByteLength: -1});
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("RangeError");
      expect(err.message).to.equal("options.totalByteLength");
    }

    const s2 = createStream(15);
    const reader2 = new ByteStream.Reader();
    try {
      await reader2.read(s2, {totalByteLength: "1"});
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("TypeError");
      expect(err.message).to.equal("options.totalByteLength");
    }

  });

  it("ByteStream.Reader.prototype.read(ReadableStream, {signal:AbortSignal})", async () => {
    const s1 = createStream(100);
    const reader1 = new ByteStream.Reader();
    const ac1 = new AbortController();
    setTimeout(() => {
      ac1.abort();
    }, 5);
    try {
      await reader1.read(s1, {signal: ac1.signal});
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("AbortError");
    }

  });

  it("ByteStream.Reader.prototype.read(ReadableStream, {signal:AbortSignal}) - error", async () => {
    const s2 = createStream(100);
    const reader2 = new ByteStream.Reader();
    try {
      await reader2.read(s2, {signal: {}});
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("TypeError");
    }

  });

  it("ByteStream.Reader.prototype.read(ReadableStream, {signal:AbortSignal}) - error", async () => {
    const s2 = createStream(100);
    const reader2 = new ByteStream.Reader();
    const ac2 = new AbortController();
    ac2.abort();
    try {
      await reader2.read(s2, {signal: ac2.signal});
      throw new Error();
    }catch(e){
      const err = e;
      expect(err.name).to.equal("AbortError");
      expect(err.message).to.equal("already aborted");
    }

  });

  it("ByteStream.Reader.prototype.read(ReadableStream)/addEventListener()", async () => {
    const s1 = createStream(8);
    const reader1 = new ByteStream.Reader();

    let loadedLength = -1;
    let totalLength = -1;
    let lengthComputable = undefined;
    const names = [];
    const listener = (e) => {
      names.push(e.type);
      loadedLength = e.loaded;
      totalLength = e.total;
      lengthComputable = e.lengthComputable;
    }

    reader1.addEventListener("loadstart", listener);
    reader1.addEventListener("load", listener);
    reader1.addEventListener("progress", listener);
    reader1.addEventListener("abort", listener);
    reader1.addEventListener("timeout", listener);
    reader1.addEventListener("error", listener);
    reader1.addEventListener("loadend", listener);

    const bs1 = await reader1.read(s1);
    expect(bs1.byteLength).to.equal(8);
    expect(loadedLength).to.equal(8);
    expect(totalLength).to.equal(0);
    expect(lengthComputable).to.equal(false);
    expect(names.filter(n => n==="loadstart").length).to.equal(1);
    expect(names.filter(n => n==="load").length).to.equal(1);
    expect(names.filter(n => n==="progress").length).to.greaterThanOrEqual(1);
    expect(names.filter(n => n==="abort").length).to.equal(0);
    expect(names.filter(n => n==="timeout").length).to.equal(0);
    expect(names.filter(n => n==="error").length).to.equal(0);
    expect(names.filter(n => n==="loadend").length).to.equal(1);

  });

  it("ByteStream.Reader.prototype.read(ReadableStream)/addEventListener() - total", async () => {
    const s1 = createStream(8);
    const reader1 = new ByteStream.Reader();

    let loadedLength = -1;
    let totalLength = -1;
    let lengthComputable = undefined;
    const names = [];
    const listener = (e) => {
      names.push(e.type);
      loadedLength = e.loaded;
      totalLength = e.total;
      lengthComputable = e.lengthComputable;
    }

    reader1.addEventListener("loadstart", listener);
    reader1.addEventListener("load", listener);
    reader1.addEventListener("progress", listener);
    reader1.addEventListener("abort", listener);
    reader1.addEventListener("timeout", listener);
    reader1.addEventListener("error", listener);
    reader1.addEventListener("loadend", listener);

    const bs1 = await reader1.read(s1, { totalByteLength: 200 });
    expect(bs1.byteLength).to.equal(8);
    expect(loadedLength).to.equal(8);
    expect(totalLength).to.equal(200);
    expect(lengthComputable).to.equal(true);
    expect(names.filter(n => n==="loadstart").length).to.equal(1);
    expect(names.filter(n => n==="load").length).to.equal(1);
    expect(names.filter(n => n==="progress").length).to.greaterThanOrEqual(1);
    expect(names.filter(n => n==="abort").length).to.equal(0);
    expect(names.filter(n => n==="timeout").length).to.equal(0);
    expect(names.filter(n => n==="error").length).to.equal(0);
    expect(names.filter(n => n==="loadend").length).to.equal(1);

  });

  it("ByteStream.Reader.prototype.read(ReadableStream)/addEventListener() - abort", async () => {
    const s1 = createStream(8);
    const reader1 = new ByteStream.Reader();
    let loadedLength = -1;
    let totalLength = -1;
    let lengthComputable = undefined;
    const names = [];
    const listener = (e) => {
      names.push(e.type);
      loadedLength = e.loaded;
      totalLength = e.total;
      lengthComputable = e.lengthComputable;
    }

    reader1.addEventListener("loadstart", listener);
    reader1.addEventListener("load", listener);
    reader1.addEventListener("progress", listener);
    reader1.addEventListener("abort", listener);
    reader1.addEventListener("timeout", listener);
    reader1.addEventListener("error", listener);
    reader1.addEventListener("loadend", listener);

    const ac1 = new AbortController();
    setTimeout(() => {
      ac1.abort();
    }, 20);
    try {
      const bs1 = await reader1.read(s1, { signal: ac1.signal });
      throw new Error();
    }catch(ex){
    }
    //expect(bs1.byteLength).to.equal(8);
    expect(loadedLength).to.greaterThanOrEqual(1);
    expect(totalLength).to.equal(0);
    expect(lengthComputable).to.equal(false);
    expect(names.filter(n => n==="loadstart").length).to.equal(1);
    expect(names.filter(n => n==="load").length).to.equal(0);
    expect(names.filter(n => n==="progress").length).to.greaterThanOrEqual(1);
    expect(names.filter(n => n==="abort").length).to.equal(1);
    expect(names.filter(n => n==="timeout").length).to.equal(0);
    expect(names.filter(n => n==="error").length).to.equal(0);
    expect(names.filter(n => n==="loadend").length).to.equal(1);

  });

  //TODO "error"




});
