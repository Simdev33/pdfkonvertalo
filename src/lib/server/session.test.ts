import { describe, expect, it } from "vitest";
import { keyedHash, sign, unsign } from "./session";

describe("signed cookies", () => {
  it("round-trips a payload", () => {
    const token = sign({ customer: "cus_123", email: "anna@example.com" });
    expect(unsign(token)).toEqual({ customer: "cus_123", email: "anna@example.com" });
  });

  it("rejects tampered or malformed tokens", () => {
    const token = sign({ customer: "cus_123", email: "anna@example.com" });
    const [body, mac] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ customer: "cus_999", email: "anna@example.com" })).toString("base64url");
    expect(unsign(`${forged}.${mac}`)).toBeNull();
    expect(unsign(`${body}.${mac.slice(1)}`)).toBeNull();
    expect(unsign("garbage")).toBeNull();
    expect(unsign(undefined)).toBeNull();
  });

  it("hashes login codes per customer", () => {
    expect(keyedHash("cus_1:123456")).toBe(keyedHash("cus_1:123456"));
    expect(keyedHash("cus_1:123456")).not.toBe(keyedHash("cus_2:123456"));
    expect(keyedHash("cus_1:123456")).not.toContain("123456");
  });
});
