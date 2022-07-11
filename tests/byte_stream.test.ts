import { assertStrictEquals } from "std/testing/asserts";
import { ByteStream } from "../src/byte_stream.ts";

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function createStream(length: number) {
  let ti: any;
  return new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
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

Deno.test("ByteStream.Reader.prototype.read(ReadableStream)", async () => {
  const s1 = createStream(8);

  const reader1 = new ByteStream.Reader();
  const bs1 = await reader1.read(s1);

  assertStrictEquals(bs1.byteLength, 8);

  const s2 = createStream(8);
  try {
    await reader1.read(s2);
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "InvalidStateError");
    assertStrictEquals(err.message, "readyState: 2");
  }
});

Deno.test("ByteStream.Reader.prototype.read(AsyncIterable<Uint8Array>)", async () => {
  const reader1 = new ByteStream.Reader();
  const ai1 = async function* () {
    yield Uint8Array.of(1);
    yield Uint8Array.of(2, 3);
  };
  const bs1 = await reader1.read(ai1());
  assertStrictEquals(bs1.byteLength, 3);

  const reader2 = new ByteStream.Reader();
  const ai2 = async function* () {
    return;
  };
  const bs2 = await reader2.read(ai2());
  assertStrictEquals(bs2.byteLength, 0);
});

Deno.test("ByteStream.Reader.prototype.read(AsyncIterable<*>)", async () => {
  const reader1 = new ByteStream.Reader();
  const ai1 = async function* () {
    yield 1;
    yield 2;
  };
  try {
    await reader1.read(ai1() as unknown as AsyncIterable<Uint8Array>);
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "TypeError");
    assertStrictEquals(err.message, "asyncSource");
  }
});

Deno.test("ByteStream.Reader.prototype.read(*)", async () => {
  const reader1 = new ByteStream.Reader();
  try {
    await reader1.read(3 as unknown as AsyncIterable<Uint8Array>);
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "TypeError");
    assertStrictEquals(err.message, "stream");
  }
});

Deno.test("ByteStream.Reader.prototype.read(Iterable<Uint8Array>)", async () => {
  const reader1 = new ByteStream.Reader();
  const bs1 = await reader1.read([Uint8Array.of(1), Uint8Array.of(2, 3)]);
  assertStrictEquals(bs1.byteLength, 3);

  const reader2 = new ByteStream.Reader();
  const bs2 = await reader2.read([]);
  assertStrictEquals(bs2.byteLength, 0);
});

Deno.test("ByteStream.Reader.prototype.read(Iterable<*>)", async () => {
  const reader1 = new ByteStream.Reader();
  try {
    await reader1.read([3] as unknown as Iterable<Uint8Array>);
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "TypeError");
    assertStrictEquals(err.message, "asyncSource");
  }
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream, {totalByteLength: number})", async () => {
  const s1 = createStream(8);
  const reader1 = new ByteStream.Reader();
  const bs1 = await reader1.read(s1, { totalByteLength: 8 });
  assertStrictEquals(bs1.byteLength, 8);
  assertStrictEquals(bs1.buffer.byteLength, 8);

  const s2 = createStream(8);
  const reader2 = new ByteStream.Reader();
  const bs2 = await reader2.read(s2, { totalByteLength: 9 });
  assertStrictEquals(bs2.byteLength, 8);
  assertStrictEquals(bs2.buffer.byteLength, 8);

  const s3 = createStream(8);
  const reader3 = new ByteStream.Reader();
  const bs3 = await reader3.read(s3, { totalByteLength: 7 });
  assertStrictEquals(bs3.byteLength, 8);
  assertStrictEquals(bs3.buffer.byteLength, 8);

  const s4 = createStream(8);
  const reader4 = new ByteStream.Reader();
  const bs4 = await reader4.read(s4, { totalByteLength: 0 });
  assertStrictEquals(bs4.byteLength, 8);
  assertStrictEquals(bs4.buffer.byteLength, 8);

  const s5 = createStream(8);
  const reader5 = new ByteStream.Reader();
  const bs5 = await reader5.read(s5, { totalByteLength: undefined });
  assertStrictEquals(bs5.byteLength, 8);
  assertStrictEquals(bs5.buffer.byteLength, 8);
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream, {totalByteLength:number}) - error", async () => {
  const s1 = createStream(15);
  const reader1 = new ByteStream.Reader();
  try {
    await reader1.read(s1, { totalByteLength: -1 });
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "RangeError");
    assertStrictEquals(err.message, "options.totalByteLength");
  }

  const s2 = createStream(15);
  const reader2 = new ByteStream.Reader();
  try {
    await reader2.read(s2, { totalByteLength: "1" as unknown as number });
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "TypeError");
    assertStrictEquals(err.message, "options.totalByteLength");
  }
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream, {signal:AbortSignal})", async () => {
  const s1 = createStream(100);
  const reader1 = new ByteStream.Reader();
  const ac1 = new AbortController();
  setTimeout(() => {
    ac1.abort();
  }, 5);
  try {
    await reader1.read(s1, { signal: ac1.signal });
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "AbortError");
  }
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream, {signal:AbortSignal}) - error", async () => {
  const s2 = createStream(100);
  const reader2 = new ByteStream.Reader();
  try {
    await reader2.read(s2, { signal: {} as unknown as AbortSignal });
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "TypeError");
  }
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream, {signal:AbortSignal}) - error", async () => {
  const s2 = createStream(100);
  const reader2 = new ByteStream.Reader();
  const ac2 = new AbortController();
  ac2.abort();
  try {
    await reader2.read(s2, { signal: ac2.signal });
    throw new Error();
  } catch (e) {
    const err = e as Error;
    assertStrictEquals(err.name, "AbortError");
    assertStrictEquals(err.message, "already aborted");
  }
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream)/addEventListener()", async () => {
  const s1 = createStream(8);
  const reader1 = new ByteStream.Reader();

  let loadedLength = -1;
  let totalLength = -1;
  let lengthComputable = undefined;
  const names: string[] = [];
  const listener = (e: ProgressEvent) => {
    names.push(e.type);
    loadedLength = e.loaded;
    totalLength = e.total;
    lengthComputable = e.lengthComputable;
  };

  reader1.addEventListener("loadstart", listener as EventListener);
  reader1.addEventListener("load", listener as EventListener);
  reader1.addEventListener("progress", listener as EventListener);
  reader1.addEventListener("abort", listener as EventListener);
  reader1.addEventListener("timeout", listener as EventListener);
  reader1.addEventListener("error", listener as EventListener);
  reader1.addEventListener("loadend", listener as EventListener);

  const bs1 = await reader1.read(s1);
  assertStrictEquals(bs1.byteLength, 8);
  assertStrictEquals(loadedLength, 8);
  assertStrictEquals(totalLength, 0);
  assertStrictEquals(lengthComputable, false);
  assertStrictEquals(names.filter((n) => n === "loadstart").length, 1);
  assertStrictEquals(names.filter((n) => n === "load").length, 1);
  assertStrictEquals(names.filter((n) => n === "progress").length >= 1, true);
  assertStrictEquals(names.filter((n) => n === "abort").length, 0);
  assertStrictEquals(names.filter((n) => n === "timeout").length, 0);
  assertStrictEquals(names.filter((n) => n === "error").length, 0);
  assertStrictEquals(names.filter((n) => n === "loadend").length, 1);
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream)/addEventListener() - total", async () => {
  const s1 = createStream(8);
  const reader1 = new ByteStream.Reader();

  let loadedLength = -1;
  let totalLength = -1;
  let lengthComputable = undefined;
  const names: string[] = [];
  const listener = (e: ProgressEvent) => {
    names.push(e.type);
    loadedLength = e.loaded;
    totalLength = e.total;
    lengthComputable = e.lengthComputable;
  };

  reader1.addEventListener("loadstart", listener as EventListener);
  reader1.addEventListener("load", listener as EventListener);
  reader1.addEventListener("progress", listener as EventListener);
  reader1.addEventListener("abort", listener as EventListener);
  reader1.addEventListener("timeout", listener as EventListener);
  reader1.addEventListener("error", listener as EventListener);
  reader1.addEventListener("loadend", listener as EventListener);

  const bs1 = await reader1.read(s1, { totalByteLength: 200 });
  assertStrictEquals(bs1.byteLength, 8);
  assertStrictEquals(loadedLength, 8);
  assertStrictEquals(totalLength, 200);
  assertStrictEquals(lengthComputable, true);
  assertStrictEquals(names.filter((n) => n === "loadstart").length, 1);
  assertStrictEquals(names.filter((n) => n === "load").length, 1);
  assertStrictEquals(names.filter((n) => n === "progress").length >= 1, true);
  assertStrictEquals(names.filter((n) => n === "abort").length, 0);
  assertStrictEquals(names.filter((n) => n === "timeout").length, 0);
  assertStrictEquals(names.filter((n) => n === "error").length, 0);
  assertStrictEquals(names.filter((n) => n === "loadend").length, 1);
});

Deno.test("ByteStream.Reader.prototype.read(ReadableStream)/addEventListener() - abort", async () => {
  const s1 = createStream(8);
  const reader1 = new ByteStream.Reader();
  let loadedLength = -1;
  let totalLength = -1;
  let lengthComputable = undefined;
  const names: string[] = [];
  const listener = (e: ProgressEvent) => {
    names.push(e.type);
    loadedLength = e.loaded;
    totalLength = e.total;
    lengthComputable = e.lengthComputable;
  };

  reader1.addEventListener("loadstart", listener as EventListener);
  reader1.addEventListener("load", listener as EventListener);
  reader1.addEventListener("progress", listener as EventListener);
  reader1.addEventListener("abort", listener as EventListener);
  reader1.addEventListener("timeout", listener as EventListener);
  reader1.addEventListener("error", listener as EventListener);
  reader1.addEventListener("loadend", listener as EventListener);

  const ac1 = new AbortController();
  setTimeout(() => {
    ac1.abort();
  }, 20);
  try {
    const bs1 = await reader1.read(s1, { signal: ac1.signal });
    throw new Error();
  } catch (ex) {
  }
  //assertStrictEquals(bs1.byteLength, 8);
  assertStrictEquals(loadedLength >= 1, true);
  assertStrictEquals(totalLength, 0);
  assertStrictEquals(lengthComputable, false);
  assertStrictEquals(names.filter((n) => n === "loadstart").length, 1);
  assertStrictEquals(names.filter((n) => n === "load").length, 0);
  assertStrictEquals(names.filter((n) => n === "progress").length >= 1, true);
  assertStrictEquals(names.filter((n) => n === "abort").length, 1);
  assertStrictEquals(names.filter((n) => n === "timeout").length, 0);
  assertStrictEquals(names.filter((n) => n === "error").length, 0);
  assertStrictEquals(names.filter((n) => n === "loadend").length, 1);
});

//TODO "error"
