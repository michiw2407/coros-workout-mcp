import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveDateRange } from "../date-utils.js";

describe("resolveDateRange", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves '7d' to last 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-18"));
    const result = resolveDateRange("7d");
    expect(result).toEqual({ startDay: "20260411", endDay: "20260418" });
  });

  it("resolves '30d' to last 30 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-18"));
    const result = resolveDateRange("30d");
    expect(result).toEqual({ startDay: "20260319", endDay: "20260418" });
  });

  it("resolves '90d' to last 90 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-18"));
    const result = resolveDateRange("90d");
    expect(result).toEqual({ startDay: "20260118", endDay: "20260418" });
  });

  it("resolves 'year' to last 365 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-18"));
    const result = resolveDateRange("year");
    expect(result).toEqual({ startDay: "20250418", endDay: "20260418" });
  });

  it("passes through explicit startDay/endDay", () => {
    const result = resolveDateRange(undefined, "20260101", "20260331");
    expect(result).toEqual({ startDay: "20260101", endDay: "20260331" });
  });

  it("throws when neither period nor dates provided", () => {
    expect(() => resolveDateRange()).toThrow(
      "Provide either a period preset or startDay/endDay"
    );
  });

  it("throws when only startDay provided", () => {
    expect(() => resolveDateRange(undefined, "20260101")).toThrow(
      "Both startDay and endDay are required"
    );
  });
});
