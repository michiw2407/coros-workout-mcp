import { SportTypeCode } from "./types.js";

function sportName(sportType: number): string {
  return (SportTypeCode as Record<number, string>)[sportType] || `Sport ${sportType}`;
}

function formatDistance(meters: number): string {
  if (meters === 0) return "";
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatPace(speed: number): string {
  if (!speed || speed === 0) return "";
  const paceSeconds = Math.round(1000 / (speed / 100));
  const min = Math.floor(paceSeconds / 60);
  const sec = paceSeconds % 60;
  return `${min}:${String(sec).padStart(2, "0")}/km`;
}

export function formatUserProfile(data: Record<string, unknown>): string {
  const zone = (data.zoneData || {}) as Record<string, unknown>;
  const lines = [
    `User Profile: ${data.nickname}`,
    ``,
    `Physical: Weight: ${data.weight} kg | Height: ${data.stature} cm | Birthday: ${data.birthday}`,
    `Heart Rate: Max HR: ${data.maxHr} | Resting HR: ${data.rhr}`,
    `Thresholds: LTHR: ${zone.lthr || "N/A"} | LTSP: ${zone.ltsp || "N/A"} | FTP: ${zone.ftp || "N/A"}`,
  ];

  const maxHrZone = zone.maxHrZone as Array<{ index: number; hr: number; ratio: number }> | undefined;
  if (maxHrZone && maxHrZone.length > 0) {
    lines.push(``);
    lines.push(`HR Zones (max HR based):`);
    for (const z of maxHrZone) {
      lines.push(`  Z${z.index + 1}: ${z.hr} bpm (${z.ratio}%)`);
    }
  }

  return lines.join("\n");
}

export function formatDashboard(data: Record<string, unknown>): string {
  const lines = ["Dashboard Overview", ""];
  const summary = data.summaryInfo as Record<string, unknown> | undefined;
  if (summary) {
    lines.push(`Fitness: ATI ${summary.ati ?? "N/A"} | CTI ${summary.cti ?? "N/A"} | Fatigue rate: ${summary.tiredRateNew ?? "N/A"}`);
    lines.push(`Training load ratio: ${summary.trainingLoadRatio ?? "N/A"} (${summary.trainingLoadRatioState ?? ""})`);
    lines.push(``);
  }

  const sportData = data.sportDataList as Array<Record<string, unknown>> | undefined;
  if (sportData && sportData.length > 0) {
    lines.push(`Recent Activities:`);
    for (const s of sportData) {
      const dist = formatDistance(Number(s.distance) || 0);
      const dur = formatDuration(Number(s.duration) || 0);
      const sport = sportName(Number(s.mode) || 0);
      lines.push(`  ${s.happenDay} | ${sport} | ${dist || dur} | ${s.sets ? s.sets + " sets" : ""}`);
    }
  }

  return lines.join("\n");
}

export function formatPersonalRecords(data: Record<string, unknown>): string {
  const records = data.allRecordList as Array<Record<string, unknown>> | undefined;
  if (!records || records.length === 0) {
    return "No personal records found.";
  }
  const lines = ["Personal Records", ""];
  for (const r of records) {
    lines.push(`${r.name || r.type}: ${r.value ?? ""} (${r.happenDay ?? ""})`);
  }
  return lines.join("\n");
}

export function formatFitnessTrend(data: Record<string, unknown>): string {
  const lines = ["EvoLab Fitness Trend", ""];

  const t7 = data.t7dayList as Array<Record<string, unknown>> | undefined;
  if (t7 && t7.length > 0) {
    lines.push("Last 7 Days:");
    for (const day of t7) {
      const tl = Number(day.distance) || 0;
      lines.push(`  ${day.happenDay}: ATI ${day.ati ?? "N/A"} | CTI ${day.cti ?? "N/A"} | Distance ${formatDistance(tl)} | LTHR ${day.lthr ?? "N/A"} | LTSP ${day.ltsp ?? "N/A"}`);
    }
    lines.push(``);
  }

  const stats = data.sportStatistic as Array<Record<string, unknown>> | undefined;
  if (stats && stats.length > 0) {
    lines.push("Sport Statistics:");
    for (const s of stats) {
      lines.push(`  ${sportName(Number(s.sportType))}: ${s.count} activities | ${formatDistance(Number(s.distance) || 0)} | ${formatDuration(Number(s.duration) || 0)} | Load ${s.trainingLoad}`);
    }
    lines.push(``);
  }

  const weeks = data.weekList as Array<Record<string, unknown>> | undefined;
  if (weeks && weeks.length > 0) {
    lines.push("Weekly Summary:");
    for (const w of weeks) {
      lines.push(`  Week of ${w.firstDayOfWeek}: Load ${w.trainingLoad} (recommended ${w.recomendTlMin}-${w.recomendTlMax})`);
    }
  }

  return lines.join("\n");
}

export function formatTrainingLoad(data: Record<string, unknown>): string {
  const tl = data.tlIntensity as Record<string, unknown> | undefined;
  if (!tl) return "No training load data.";

  const lines = [
    "Training Load",
    "",
    `Total: ${tl.totalValue} / ${tl.totalTarget} target (${tl.percentage}%)`,
    `Activities: ${tl.count}`,
  ];

  const details = tl.detailList as Array<Record<string, unknown>> | undefined;
  if (details && details.length > 0) {
    lines.push(``);
    lines.push(`Intensity Breakdown:`);
    for (const d of details) {
      lines.push(`  ${d.name || d.type}: ${d.value} (${d.percentage}%)`);
    }
  }

  return lines.join("\n");
}

export function formatTrainingSummary(data: Record<string, unknown>): string {
  const lines = ["Training Summary", ""];

  const summary = data.summaryInfo as Record<string, unknown> | undefined;
  if (summary) {
    lines.push(`Overview: ${JSON.stringify(summary)}`);
    lines.push(``);
  }

  const stats = data.sportStatistic as Array<Record<string, unknown>> | undefined;
  if (stats && stats.length > 0) {
    lines.push("By Sport:");
    for (const s of stats) {
      lines.push(`  ${sportName(Number(s.sportType))}: ${s.count} activities | ${formatDistance(Number(s.distance) || 0)} | ${formatDuration(Number(s.duration) || 0)} | Avg HR ${s.avgHeartRate} | Load ${s.trainingLoad}`);
    }
  }

  return lines.join("\n");
}

export function formatDailyTraining(data: Record<string, unknown>): string {
  const days = data.dayList as Array<Record<string, unknown>> | undefined;
  if (!days || days.length === 0) return "No daily training data.";

  const lines = ["Daily Training", ""];
  for (const day of days) {
    const dist = formatDistance(Number(day.distance) || 0);
    const dur = formatDuration(Number(day.duration) || 0);
    lines.push(`${day.happenDay}: ATI ${day.ati ?? "N/A"} | CTI ${day.cti ?? "N/A"} | ${dist || "no distance"} | ${dur} | Performance ${day.performance ?? "N/A"}`);
  }

  const weeks = data.weekList as Array<Record<string, unknown>> | undefined;
  if (weeks && weeks.length > 0) {
    lines.push(``);
    lines.push("Weekly Aggregates:");
    for (const w of weeks) {
      lines.push(`  Week of ${w.firstDayOfWeek}: Load ${w.trainingLoad} (target ${w.recomendTlMin}-${w.recomendTlMax})`);
    }
  }

  return lines.join("\n");
}

export function formatActivities(data: Record<string, unknown>): string {
  const list = data.dataList as Array<Record<string, unknown>> | undefined;
  if (!list || list.length === 0) return "No activities found.";

  const count = data.count as number;
  const page = data.pageNumber as number;
  const totalPages = data.totalPage as number;

  const lines = [`Activities (page ${page}/${totalPages}, ${count} total):`, ""];

  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    const sport = sportName(Number(a.sportType));
    const dist = formatDistance(Number(a.distance) || 0);
    const dur = formatDuration(Number(a.workoutTime) || 0);
    const hr = a.avgHr ? `Avg HR ${a.avgHr}` : "";
    const load = a.trainingLoad ? `Load ${a.trainingLoad}` : "";
    const sets = Number(a.sets) > 0 ? `${a.sets} sets` : "";
    const reps = Number(a.totalReps) > 0 ? `${a.totalReps} reps` : "";

    const parts = [a.date, sport, dist, dur, sets, reps, hr, load].filter(Boolean);
    lines.push(`${i + 1}. ${parts.join(" | ")} [labelId: ${a.labelId}, sportType: ${a.sportType}]`);
  }

  return lines.join("\n");
}

export function formatActivityDetail(data: Record<string, unknown>): string {
  const summary = (data.summary || {}) as Record<string, unknown>;
  const sport = sportName(Number(summary.sportType));
  const lines = [`${sport} — ${summary.date || ""}`, ""];

  const dist = formatDistance(Number(summary.distance) || 0);
  const dur = formatDuration(Number(summary.totalTime) || 0);
  const pace = formatPace(Number(summary.avgSpeed) || 0);
  const elevation = Number(summary.totalAscent) ? `+${summary.totalAscent}m` : "";

  const summaryParts = [dist, dur, pace, elevation].filter(Boolean);
  if (summaryParts.length > 0) {
    lines.push(`Summary: ${summaryParts.join(" | ")}`);
  }

  if (summary.avgHr) {
    lines.push(`HR: Avg HR: ${summary.avgHr} | Max HR: ${summary.maxHr || "N/A"}`);
  }

  if (summary.avgCadence && Number(summary.avgCadence) > 0) {
    lines.push(`Cadence: ${summary.avgCadence} spm`);
  }

  const loadParts: string[] = [];
  if (summary.trainingLoad) loadParts.push(`Training Load: ${summary.trainingLoad}`);
  if (summary.aerobicEffect) loadParts.push(`Aerobic Effect: ${(Number(summary.aerobicEffect) / 10).toFixed(1)}`);
  if (summary.anaerobicEffect) loadParts.push(`Anaerobic Effect: ${(Number(summary.anaerobicEffect) / 10).toFixed(1)}`);
  if (summary.calorie) loadParts.push(`Calories: ${summary.calorie}`);
  if (loadParts.length > 0) lines.push(loadParts.join(" | "));

  if (Number(summary.sets) > 0 || Number(summary.totalReps) > 0) {
    lines.push(`${summary.sets || 0} sets | ${summary.totalReps || 0} reps`);
  }

  const zones = data.zoneList as Array<Record<string, unknown>> | undefined;
  if (zones && zones.length > 0) {
    const hrZone = zones.find((z) => z.type === 1);
    if (hrZone) {
      const items = hrZone.zoneItemList as Array<Record<string, unknown>> | undefined;
      if (items && items.length > 0) {
        const zoneStr = items.map((z, i) => `Z${i + 1}: ${z.ratio}%`).join(", ");
        lines.push(`HR Zones: ${zoneStr}`);
      }
    }
  }

  const laps = data.lapList as Array<Record<string, unknown>> | undefined;
  if (laps && laps.length > 0) {
    for (const lapGroup of laps) {
      const items = lapGroup.lapItemList as Array<Record<string, unknown>> | undefined;
      if (items && items.length > 0) {
        lines.push(``);
        lines.push(`Splits (${items.length}):`);
        for (let i = 0; i < items.length; i++) {
          const lap = items[i];
          const lapPace = formatPace(Number(lap.avgSpeed) || 0);
          const lapHr = lap.avgHr ? `HR ${lap.avgHr}` : "";
          const lapDist = formatDistance(Number(lap.lapDistance) || 0);
          const parts = [lapDist, lapPace, lapHr].filter(Boolean);
          lines.push(`  ${i + 1}. ${parts.join(" | ")}`);
        }
      }
    }
  }

  const muscles = data.muscleList as Array<Record<string, unknown>> | undefined;
  if (muscles && muscles.length > 0) {
    lines.push(``);
    lines.push(`Muscles Worked:`);
    for (const m of muscles) {
      lines.push(`  ${m.muscleKey}: ${m.sets} sets, ${m.reps} reps, ${formatDuration(Number(m.duration) || 0)}`);
    }
  }

  const graphs = data.graphList as Array<Record<string, unknown>> | undefined;
  if (graphs && graphs.length > 0) {
    lines.push(``);
    lines.push(`Time Series Data:`);
    for (const g of graphs) {
      const items = g.graphItem as number[] | undefined;
      if (items && items.length > 0) {
        lines.push(`  ${g.key}: [${items.length} data points] min=${Math.min(...items)} max=${Math.max(...items)} avg=${Math.round(items.reduce((a, b) => a + b, 0) / items.length)}`);
      }
    }
  }

  const devices = data.deviceList as Array<Record<string, unknown>> | undefined;
  if (devices && devices.length > 0) {
    lines.push(`Device: ${devices[0].name}`);
  }

  return lines.join("\n");
}

export function formatTrainingSchedule(
  scheduleData: Record<string, unknown>,
  sumData: Record<string, unknown>
): string {
  const lines = ["Training Schedule", ""];

  const daySums = sumData.dayTrainSums as Array<Record<string, unknown>> | undefined;
  if (daySums && daySums.length > 0) {
    lines.push("Daily Schedule:");
    for (const d of daySums) {
      lines.push(`  ${d.day}: ${d.trainCount || 0} planned, ${d.executeCount || 0} completed`);
    }
    lines.push(``);
  }

  const today = sumData.todayTrainingSum as Record<string, unknown> | undefined;
  if (today) {
    lines.push(`Today: ${today.trainCount || 0} planned, ${today.executeCount || 0} completed`);
  }

  const weeks = sumData.weekTrains as Array<Record<string, unknown>> | undefined;
  if (weeks && weeks.length > 0) {
    lines.push(``);
    lines.push("Weekly Schedule:");
    for (const w of weeks) {
      lines.push(`  Week of ${w.startDate}: ${w.trainCount || 0} planned, ${w.executeCount || 0} completed`);
    }
  }

  const programs = scheduleData.programs as Array<Record<string, unknown>> | undefined;
  if (programs && programs.length > 0) {
    lines.push(``);
    lines.push(`Scheduled Programs (${programs.length}):`);
    for (const p of programs) {
      lines.push(`  ${p.name}: ${sportName(Number(p.sportType))} | Status: ${p.executeStatus}`);
    }
  }

  return lines.join("\n");
}
