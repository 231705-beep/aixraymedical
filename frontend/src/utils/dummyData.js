export const DUMMY_PATIENTS = [
    { id: "P-101", name: "John Doe", type: "Chest X-ray", status: "AI Flagged", date: "Oct 25, 2025" },
    { id: "P-102", name: "Alice Smith", type: "Hand X-ray", status: "Verified", date: "Oct 24, 2025" },
    { id: "P-103", name: "Robert Brown", type: "Pelvis X-ray", status: "Critical", date: "Oct 24, 2025" },
    { id: "P-104", name: "Emily White", type: "Chest X-ray", status: "Normal", date: "Oct 23, 2025" }
];

export const DUMMY_DOCTORS = [
    { name: "Dr. Sarah Johnson", spec: "Radiologist", exp: "12 yrs", img: "SJ" },
    { name: "Dr. Michael Chen", spec: "Senior Radiologist", exp: "8 yrs", img: "MC" },
    { name: "Dr. Emma Wilson", spec: "General Surgeon", exp: "15 yrs", img: "EW" }
];

export const DUMMY_INVESTIGATIONS = [
    { id: 1, date: "Oct 13, 2025", type: "Chest X-ray", aiStatus: "Normal", docStatus: "Verified" },
    { id: 2, date: "Oct 12, 2025", type: "Chest X-ray", aiStatus: "Abnormal", docStatus: "Pending" },
    { id: 3, date: "Oct 11, 2025", type: "Hand X-ray", aiStatus: "Normal", docStatus: "Verified" }
];
