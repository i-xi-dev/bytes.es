import assert from "node:assert";
import { Base64 } from "../../../../../dist/byte/index.js";

describe("Base64.encode", () => {
  it("encode(Uint8Array)", () => {
    assert.strictEqual(Base64.encode(Uint8Array.of()), "");
    assert.strictEqual(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252)), "AwIBAP/+/fw=");
    assert.strictEqual(Base64.encode(Uint8Array.of(255)), "/w==");
    assert.strictEqual(Base64.encode(Uint8Array.of(251)), "+w==");

    assert.strictEqual(Base64.encode(Uint8Array.of(251), {table:"rfc4648-url"}), "-w==");

    assert.strictEqual(Base64.encode(Uint8Array.of(255), {table:"rfc4648-url"}), "_w==");

    assert.strictEqual(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252), {table:"rfc4648-url"}), "AwIBAP_-_fw=");

    assert.strictEqual(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252), {usePadding:false}), "AwIBAP/+/fw");
    assert.strictEqual(Base64.encode(Uint8Array.of(255), {usePadding:false}), "/w");

    assert.strictEqual(Base64.encode(Uint8Array.of(255), {usePadding:true}), "/w==");

    assert.strictEqual(Base64.encode(Uint8Array.of(3,2,1,0,255,254,253,252), {table:"rfc4648-url", usePadding:false}), "AwIBAP_-_fw");

    const r1 = crypto.getRandomValues(new Uint8Array(256));
    const r2 = crypto.getRandomValues(new Uint8Array(255));
    const r3 = crypto.getRandomValues(new Uint8Array(254));
    const r4 = crypto.getRandomValues(new Uint8Array(253));
    const r5 = crypto.getRandomValues(new Uint8Array(252));
    const r6 = crypto.getRandomValues(new Uint8Array(251));
    const r7 = crypto.getRandomValues(new Uint8Array(250));
    const r8 = crypto.getRandomValues(new Uint8Array(249));
    const r9 = crypto.getRandomValues(new Uint8Array(248));

    assert.strictEqual(Base64.encode(r1), Buffer.from(r1.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r2), Buffer.from(r2.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r3), Buffer.from(r3.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r4), Buffer.from(r4.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r5), Buffer.from(r5.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r6), Buffer.from(r6.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r7), Buffer.from(r7.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r8), Buffer.from(r8.buffer).toString("base64"));
    assert.strictEqual(Base64.encode(r9), Buffer.from(r9.buffer).toString("base64"));

    assert.strictEqual(Base64.encode(r1, {usePadding:false}), Buffer.from(r1.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r2, {usePadding:false}), Buffer.from(r2.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r3, {usePadding:false}), Buffer.from(r3.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r4, {usePadding:false}), Buffer.from(r4.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r5, {usePadding:false}), Buffer.from(r5.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r6, {usePadding:false}), Buffer.from(r6.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r7, {usePadding:false}), Buffer.from(r7.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r8, {usePadding:false}), Buffer.from(r8.buffer).toString("base64").replace(/=*$/, ""));
    assert.strictEqual(Base64.encode(r9, {usePadding:false}), Buffer.from(r9.buffer).toString("base64").replace(/=*$/, ""));

  });

});
