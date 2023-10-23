import { ByteSequence } from "https://www.unpkg.com/@i-xi-dev/bytes@4.1.3/esm/mod.js";
import { Base64 } from "https://www.unpkg.com/@i-xi-dev/base64@4.0.1/esm/mod.js";

const i1 = document.getElementById("i1");
const ip11 = document.getElementById("ip11");
const ip12 = document.getElementById("ip12");
const a1 = document.getElementById("a1");
const o1 = document.getElementById("o1");

a1.addEventListener("click", (event) => {
  const i = i1.value;
  const baseTable = [...Base64.Options.RFC4648.table];
  const [c62,c63] = ip12.value.split("");
  baseTable[62] = c62;
  baseTable[63] = c63;
  const options = {
    table: baseTable,
    noPadding: (ip11.checked !== true),
    paddingChar: "=",
  };
  const base64 = ByteSequence.fromText(i).toBase64Encoded(options);
  o1.value = base64;
}, { passive: true });

document.querySelector("*.progress").hidden = true;
