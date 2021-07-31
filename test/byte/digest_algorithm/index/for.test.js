import { DigestAlgorithm } from "../../../../dist/byte/index.js";

describe("DigestAlgorithm.for", () => {

  test("for(string)", async () => {
    expect(() => {
      DigestAlgorithm.for("SHA-25");
    }).toThrow("name:SHA-25");

  });

});
