import { describe, it, expect } from "vitest";
import { formatActivities, formatActivityDetail, formatUserProfile } from "../formatters.js";

describe("formatActivities", () => {
  it("formats a paginated activity list", () => {
    const data = {
      count: 91,
      totalPage: 5,
      pageNumber: 1,
      dataList: [
        {
          labelId: "abc123",
          sportType: 100,
          date: "2026-04-17",
          distance: 8200,
          calorie: 450,
          avgHr: 155,
          avgSpeed: 322,
          trainingLoad: 87,
          workoutTime: 2535,
          totalReps: 0,
          sets: 0,
          device: "COROS PACE 3",
          name: "",
          mode: 0,
        },
        {
          labelId: "def456",
          sportType: 402,
          date: "2026-04-16",
          distance: 0,
          calorie: 280,
          avgHr: 125,
          avgSpeed: 0,
          trainingLoad: 62,
          workoutTime: 2700,
          totalReps: 120,
          sets: 12,
          device: "COROS PACE 3",
          name: "",
          mode: 0,
        },
      ],
    };

    const result = formatActivities(data);
    expect(result).toContain("91 total");
    expect(result).toContain("page 1/5");
    expect(result).toContain("Outdoor Run");
    expect(result).toContain("8.20 km");
    expect(result).toContain("Avg HR 155");
    expect(result).toContain("Strength Training");
    expect(result).toContain("12 sets");
  });

  it("handles empty activity list", () => {
    const data = { count: 0, totalPage: 0, pageNumber: 1, dataList: [] };
    const result = formatActivities(data);
    expect(result).toContain("No activities found");
  });
});

describe("formatUserProfile", () => {
  it("formats user profile with HR zones", () => {
    const data = {
      nickname: "miwe",
      maxHr: 193,
      rhr: 45,
      weight: 74,
      stature: 176,
      birthday: 19970724,
      sex: 0,
      zoneData: {
        lthr: 168,
        ltsp: 370,
        ftp: 165,
        maxHrZone: [
          { index: 0, hr: 97, ratio: 50 },
          { index: 1, hr: 116, ratio: 60 },
          { index: 2, hr: 135, ratio: 70 },
          { index: 3, hr: 155, ratio: 80 },
          { index: 4, hr: 174, ratio: 90 },
          { index: 5, hr: 193, ratio: 100 },
        ],
      },
    };

    const result = formatUserProfile(data);
    expect(result).toContain("miwe");
    expect(result).toContain("Max HR: 193");
    expect(result).toContain("Resting HR: 45");
    expect(result).toContain("Weight: 74 kg");
    expect(result).toContain("LTHR: 168");
  });
});

describe("formatActivityDetail", () => {
  it("formats a running activity with summary and laps", () => {
    const data = {
      summary: {
        sportType: 100,
        date: "2026-04-17",
        distance: 8200,
        totalTime: 2535,
        avgSpeed: 322,
        avgHr: 155,
        maxHr: 178,
        avgCadence: 172,
        calorie: 450,
        trainingLoad: 87,
        aerobicEffect: 32,
        anaerobicEffect: 12,
        totalAscent: 85,
      },
      lapList: [
        {
          type: 1,
          lapItemList: [
            { avgSpeed: 322, avgHr: 142, lapDistance: 1000 },
            { avgSpeed: 315, avgHr: 149, lapDistance: 1000 },
          ],
        },
      ],
      zoneList: [
        {
          type: 1,
          zoneType: 1,
          zoneItemList: [
            { ratio: 2 },
            { ratio: 15 },
            { ratio: 45 },
            { ratio: 30 },
            { ratio: 8 },
          ],
        },
      ],
      graphList: [
        { key: "heart", type: 1, graphItem: [150, 155, 160, 165] },
      ],
      muscleList: [],
      deviceList: [{ name: "COROS PACE 3" }],
    };

    const result = formatActivityDetail(data);
    expect(result).toContain("Outdoor Run");
    expect(result).toContain("8.20 km");
    expect(result).toContain("Avg HR: 155");
    expect(result).toContain("Max HR: 178");
    expect(result).toContain("Cadence: 172");
    expect(result).toContain("Training Load: 87");
  });

  it("formats a strength activity with muscles", () => {
    const data = {
      summary: {
        sportType: 402,
        date: "2026-04-16",
        distance: 0,
        totalTime: 2700,
        avgHr: 125,
        maxHr: 155,
        calorie: 280,
        trainingLoad: 62,
        sets: 12,
        totalReps: 120,
      },
      lapList: [],
      zoneList: [],
      graphList: [],
      muscleList: [
        { muscleId: 2, muscleKey: "chest", duration: 600, sets: 4, reps: 48 },
        { muscleId: 4, muscleKey: "triceps", duration: 300, sets: 3, reps: 36 },
      ],
      deviceList: [{ name: "COROS PACE 3" }],
    };

    const result = formatActivityDetail(data);
    expect(result).toContain("Strength Training");
    expect(result).toContain("12 sets");
    expect(result).toContain("120 reps");
    expect(result).toContain("chest");
  });
});
