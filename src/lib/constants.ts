export const FORM_TYPES = [
  { id: "I-485", label: "I-485", fullName: "Application to Register Permanent Residence or Adjust Status" },
  { id: "I-765", label: "I-765", fullName: "Application for Employment Authorization" },
  { id: "I-140", label: "I-140", fullName: "Immigrant Petition for Alien Workers" },
  { id: "I-130", label: "I-130", fullName: "Petition for Alien Relative" },
  { id: "I-131", label: "I-131", fullName: "Application for Travel Document" },
  { id: "I-751", label: "I-751", fullName: "Petition to Remove Conditions on Residence" },
  { id: "I-129F", label: "I-129F", fullName: "Petition for Alien Fiancé(e)" },
  { id: "N-400", label: "N-400", fullName: "Application for Naturalization" },
] as const;

export const SERVICE_CENTERS = [
  { id: "IOE-LB", prefix: "IOE", label: "IOE Lockbox" },
  { id: "MSC-LB", prefix: "MSC", label: "MSC Lockbox" },
  { id: "LIN-SC", prefix: "LIN", label: "Lincoln Service Center" },
  { id: "SRC-SC", prefix: "SRC", label: "Texas Service Center" },
  { id: "SRC-LB", prefix: "SRC", label: "SRC Lockbox" },
  { id: "LIN-LB", prefix: "LIN", label: "LIN Lockbox" },
  { id: "EAC-SC", prefix: "EAC", label: "Vermont Service Center" },
  { id: "WAC-LB", prefix: "WAC", label: "WAC Lockbox" },
  { id: "MSC-SC", prefix: "MSC", label: "MSC Service Center" },
  { id: "EAC-LB", prefix: "EAC", label: "EAC Lockbox" },
  { id: "YSC-LB", prefix: "YSC", label: "YSC Lockbox" },
] as const;

export const FORM_CENTER_MAP: Record<string, string[]> = {
  "I-485": ["IOE-LB", "MSC-LB", "LIN-SC", "SRC-SC", "SRC-LB", "LIN-LB", "EAC-SC", "WAC-LB", "MSC-SC", "EAC-LB", "YSC-LB"],
  "I-765": ["IOE-LB", "MSC-LB", "LIN-SC", "SRC-SC", "YSC-LB", "WAC-LB"],
  "I-140": ["IOE-LB", "LIN-SC", "SRC-SC", "EAC-SC"],
  "I-130": ["IOE-LB", "MSC-LB", "LIN-SC", "SRC-SC", "EAC-SC", "WAC-LB"],
  "I-131": ["IOE-LB", "MSC-LB", "LIN-SC", "SRC-SC"],
  "I-751": ["IOE-LB", "MSC-LB", "SRC-SC", "WAC-LB"],
  "I-129F": ["WAC-LB", "SRC-SC"],
  "N-400": ["IOE-LB", "MSC-LB", "LIN-SC", "SRC-SC"],
};

export const STATUS_CATEGORIES = [
  "Case Was Approved",
  "Case Was Received",
  "Case Is Ready To Be Scheduled For An Interview",
  "Interview Was Scheduled",
  "Case Was Denied",
  "Request for Evidence Was Sent",
  "Response To Request For Evidence Was Received",
  "New Card Is Being Produced",
  "Card Was Mailed To Me",
  "Card Was Delivered",
  "Case Was Transferred",
  "Biometrics Appointment Was Scheduled",
  "Fingerprint Fee Was Received",
  "Case Was Updated To Show Fingerprints Were Taken",
  "Expedite Request Received",
  "Name Was Updated",
] as const;

// Pastel palette — unique per status, semantically grouped
export const STATUS_COLORS: Record<string, string> = {
  // Positive outcomes — greens/teals
  "Case Was Approved": "#6BCB77",
  "New Card Is Being Produced": "#34D399",
  "Card Was Mailed To Me": "#52B8C9",
  "Card Was Delivered": "#3DAD8F",

  // Intake / processing — blues
  "Case Was Received": "#74B3E8",
  "Case Was Transferred": "#8B8FE8",

  // Interview — warm yellows/ambers
  "Case Is Ready To Be Scheduled For An Interview": "#E8C56E",
  "Interview Was Scheduled": "#D4A85A",

  // Negative — soft red
  "Case Was Denied": "#E87272",

  // Evidence requests — corals/oranges
  "Request for Evidence Was Sent": "#E89B6E",
  "Response To Request For Evidence Was Received": "#D4876A",

  // Biometrics — purples/lavenders
  "Biometrics Appointment Was Scheduled": "#A88BE8",
  "Fingerprint Fee Was Received": "#9B7CE8",
  "Case Was Updated To Show Fingerprints Were Taken": "#B8A0E8",

  // Other
  "Expedite Request Received": "#E88BAD",
  "Name Was Updated": "#A8B0BC",
};
