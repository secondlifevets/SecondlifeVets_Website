import { differenceInDays, parseISO, addDays } from "date-fns";

export type VaxStatus =
  | { state: "due"; label: string; sublabel: string; shotNum: number | null }
  | { state: "upcoming"; label: string; sublabel: string; daysLeft: number; shotNum: number | null }
  | { state: "ok"; label: string; sublabel: string };

export interface VaxRecord {
  vaccination_date: string;
  shot_type?: string | null;
  valid_until?: string | null;
  vaccine_type?: string | null; // "Rabies" or "Other" (Core)
}

function getMonthsLeftLabel(daysLeft: number) {
  const monthsLeft = Math.round(daysLeft / 30);
  if (monthsLeft <= 0) return "soon";
  return `~${monthsLeft} month${monthsLeft !== 1 ? 's' : ''}`;
}

export function evaluateVaccine(
  category: "Core" | "Rabies",
  petType: string,
  ageInDays: number | null,
  records: VaxRecord[],
  today: Date
): VaxStatus {
  // Sort records by vaccination_date desc
  const sorted = [...records].sort((a, b) => new Date(b.vaccination_date).getTime() - new Date(a.vaccination_date).getTime());
  const lastRecord = sorted.length > 0 ? sorted[0] : null;

  // ─────────────────────────────────────────────────────────────────
  // Level 1: Explicit Valid Until
  // ─────────────────────────────────────────────────────────────────
  if (lastRecord && lastRecord.valid_until) {
    const validUntilDate = parseISO(lastRecord.valid_until);
    const daysUntilNext = differenceInDays(validUntilDate, today);
    const label = `${category} Vaccination`;

    if (daysUntilNext <= 0) {
      return { state: "due", label: `${label} Due`, sublabel: `Expired ${Math.abs(daysUntilNext)} days ago`, shotNum: null };
    } else if (daysUntilNext <= 30) {
      return { state: "upcoming", label: `${label} upcoming`, sublabel: `Due in ${daysUntilNext} days`, daysLeft: daysUntilNext, shotNum: null };
    } else {
      return { state: "ok", label: "Vaccinations Up to Date", sublabel: `${label} due in ${getMonthsLeftLabel(daysUntilNext)}` };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Level 2: Explicit Shot Types (Legacy)
  // ─────────────────────────────────────────────────────────────────
  const legacyRecord = sorted.find(r => r.shot_type && r.shot_type !== 'unknown');
  
  if (legacyRecord) {
    const lastDate = parseISO(legacyRecord.vaccination_date);
    const type = legacyRecord.shot_type; // 'shot_1', 'shot_2', 'shot_3', 'shot_4', 'annual_booster'
    
    let nextShotLabel = "";
    let nextShotNum: number | null = null;
    let daysToNext = 365;

    // We use a 28-day offset for puppy/kitten shots to reduce noise
    if (petType === "Dog") {
      if (type === 'shot_1') { nextShotLabel = "Shot 2"; nextShotNum = 2; daysToNext = 28; }
      else if (type === 'shot_2') { nextShotLabel = "Shot 3"; nextShotNum = 3; daysToNext = 28; }
      else if (type === 'shot_3') { nextShotLabel = "Shot 4"; nextShotNum = 4; daysToNext = 28; }
      else { nextShotLabel = "Annual Booster"; nextShotNum = null; daysToNext = 365; }
    } else if (petType === "Cat") {
      if (type === 'shot_1') { nextShotLabel = "Shot 2"; nextShotNum = 2; daysToNext = 28; }
      else if (type === 'shot_2') { nextShotLabel = "Shot 3 (Rabies)"; nextShotNum = 3; daysToNext = 28; }
      else { nextShotLabel = "Annual Booster"; nextShotNum = null; daysToNext = 365; }
    } else {
      nextShotLabel = "Annual Booster"; nextShotNum = null; daysToNext = 365;
    }

    // Only apply the rabies specific logic if category is Rabies
    if (category === "Rabies") {
      if ((petType === "Dog" && type === "shot_3") || (petType === "Cat" && type === "shot_2")) {
         // Rabies is due next
         nextShotLabel = "Rabies";
      } else if (type === "annual_booster" || type === "shot_4" || type === "shot_3") {
         // Has had rabies before
         nextShotLabel = "Rabies Booster";
         daysToNext = 365;
      } else {
         // Has not had rabies yet, defer to Age based or Core
         return { state: "ok", label: "Rabies Pending", sublabel: "Wait for puppy/kitten shots to finish" };
      }
    }

    const nextDate = addDays(lastDate, daysToNext);
    const daysUntilNext = differenceInDays(nextDate, today);
    const prefix = category === "Rabies" && !nextShotLabel.includes("Rabies") ? "Rabies " : "";

    if (daysUntilNext <= 0) {
      return { state: "due", label: `${prefix}${nextShotLabel} Due`, sublabel: `Overdue since ${Math.abs(daysUntilNext)} days ago — book now`, shotNum: nextShotNum };
    } else if (daysUntilNext <= 30) {
      return { state: "upcoming", label: `${prefix}${nextShotLabel} upcoming`, sublabel: `Due in ${daysUntilNext} days`, daysLeft: daysUntilNext, shotNum: nextShotNum };
    } else {
      return { state: "ok", label: "Vaccinations Up to Date", sublabel: `${prefix}${nextShotLabel} due in ${getMonthsLeftLabel(daysUntilNext)}` };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Level 3: Age-Based Projection
  // ─────────────────────────────────────────────────────────────────
  if (ageInDays !== null && (petType === "Dog" || petType === "Cat")) {
    const milestones: { days: number, label: string, num: number | null, cat: "Core" | "Rabies" | "Both" }[] = [];
    
    if (petType === "Dog") {
      milestones.push({ days: 42, label: "Shot 1", num: 1, cat: "Core" });
      milestones.push({ days: 70, label: "Shot 2", num: 2, cat: "Core" });
      milestones.push({ days: 98, label: "Shot 3", num: 3, cat: "Core" });
      milestones.push({ days: 126, label: "Shot 4 (Rabies)", num: 4, cat: "Both" });
    } else if (petType === "Cat") {
      milestones.push({ days: 56, label: "Shot 1", num: 1, cat: "Core" });
      milestones.push({ days: 84, label: "Shot 2", num: 2, cat: "Core" });
      milestones.push({ days: 112, label: "Shot 3 (Rabies)", num: 3, cat: "Both" });
    }

    const relevantMilestones = milestones.filter(m => m.cat === category || m.cat === "Both");
    const nextMilestone = relevantMilestones.find(m => ageInDays <= m.days + 30);
    
    // Check if we have ANY record at all, if so, we can offset from that record
    if (lastRecord) {
       const daysSinceLastShot = differenceInDays(today, parseISO(lastRecord.vaccination_date));
       const daysLeft = 365 - daysSinceLastShot;
       
       if (daysLeft <= 0) {
           return { state: "due", label: `${category} Annual Due`, sublabel: `Overdue since ${Math.abs(daysLeft)} days ago`, shotNum: null };
       } else if (daysLeft <= 30) {
           return { state: "upcoming", label: `${category} Annual upcoming`, sublabel: `Due in ${daysLeft} days`, daysLeft, shotNum: null };
       } else {
           return { state: "ok", label: "Vaccinations Up to Date", sublabel: `${category} Annual due in ${getMonthsLeftLabel(daysLeft)}` };
       }
    }

    if (nextMilestone) {
      const daysUntilNext = nextMilestone.days - ageInDays;
      
      if (daysUntilNext <= 0) {
        return { state: "due", label: `${nextMilestone.label} Due`, sublabel: `Age-based projection — book now`, shotNum: nextMilestone.num };
      } else if (daysUntilNext <= 30) {
        return { state: "upcoming", label: `${nextMilestone.label} upcoming`, sublabel: `Due in ${daysUntilNext} days`, daysLeft: daysUntilNext, shotNum: nextMilestone.num };
      } else {
        return { state: "ok", label: "Vaccinations Up to Date", sublabel: `${nextMilestone.label} due in ${getMonthsLeftLabel(daysUntilNext)}` };
      }
    } else {
      // Pet is older than puppy milestones and has NO records.
      return { state: "due", label: `${category} Vaccination Due`, sublabel: "Adult pet vaccination needed — book now", shotNum: null };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Fallback
  // ─────────────────────────────────────────────────────────────────
  return { state: "due", label: "Vaccination Due", sublabel: "No vaccination record found — book now", shotNum: null };
}

export function getVaccinationStatus(
  petType: string,
  dateOfBirth: string | null,
  shotHistory: VaxRecord[]
): VaxStatus {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ageInDays = dateOfBirth ? differenceInDays(today, parseISO(dateOfBirth)) : null;

  const coreRecords = shotHistory.filter(r => !r.vaccine_type || r.vaccine_type === "Other");
  const rabiesRecords = shotHistory.filter(r => r.vaccine_type === "Rabies" || (!r.vaccine_type && r.shot_type && r.shot_type.includes("rabies")));

  const coreStatus = evaluateVaccine("Core", petType, ageInDays, coreRecords, today);
  const rabiesStatus = evaluateVaccine("Rabies", petType, ageInDays, rabiesRecords, today);

  const statuses = [coreStatus, rabiesStatus];
  
  const due = statuses.filter(s => s.state === "due");
  if (due.length > 0) return due[0];

  const upcoming = statuses.filter(s => s.state === "upcoming");
  if (upcoming.length > 0) {
    return upcoming.reduce((prev, curr) => (curr as any).daysLeft < (prev as any).daysLeft ? curr : prev);
  }

  return coreStatus;
}
