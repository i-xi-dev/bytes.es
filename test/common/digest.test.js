import { expect } from '@esm-bundle/chai';
import { Digest } from "../../dist/index.js";

if (globalThis.process) {
  const nodeCrypto = await import("node:crypto");
  globalThis.crypto = nodeCrypto.webcrypto;
}

describe("Sha256.compute", () => {
  it("compute(Uint8Array)", async () => {
    const r = await Digest.Sha256.compute(Uint8Array.of());
    expect([...r].map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase()).to.equal("E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855");

  });

});

describe("Sha384.compute", () => {
  it("compute(Uint8Array)", async () => {
    const r = await Digest.Sha384.compute(Uint8Array.of());
    expect([...r].map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase()).to.equal("38B060A751AC96384CD9327EB1B1E36A21FDB71114BE07434C0CC7BF63F6E1DA274EDEBFE76F65FBD51AD2F14898B95B");

  });

});

describe("Sha512.compute", () => {
  it("compute(Uint8Array)", async () => {
    const r = await Digest.Sha512.compute(Uint8Array.of());
    expect([...r].map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase()).to.equal("CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E");

  });

});
