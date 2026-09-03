// ============================================================
//  EDIT THIS FILE — it is the only one you need to change.
//  Everything else works as-is.
// ============================================================

// 1. Your team's email domain. Only these addresses can sign in.
export const ORG_DOMAIN = "tavasyacapital.in";

// 2. Your Firebase project's config (from Firebase Console -> Project settings).
//    See README.md "Step 1-2" for exactly how to get these values.
export const firebaseConfig = {
  apiKey: "AIzaSyALigG0l5R2riwo3yWYkYyqdrsYNcdguN8",
  authDomain: "tavasya-compliance-a2295.firebaseapp.com",
  projectId: "tavasya-compliance-a2295",
  storageBucket: "tavasya-compliance-a2295.firebasestorage.app",
  messagingSenderId: "166410154171",
  appId: "1:166410154171:web:34d50c569725b8fbf8399e"
};


// 3. Dropdown values used across the app.
//    NOTE: schemes are NOT listed here anymore — they're managed from the
//    "Schemes" tab in the app itself (Firestore-backed, Admin can add/archive).
//    This list only covers values that don't need runtime management.
export const OPTIONS = {
  frequencies: [
    "One-time", "Per valuation", "Ongoing", "Quarterly",
    "Half-yearly", "Annual", "Phased"
  ],
  // Seed values only — the live list lives in Firestore (complianceTypes
  // collection) so anyone can add a new type inline from the compliance
  // form. This array just seeds that collection the first time the app runs.
  defaultComplianceTypes: [
    "SEBI/AIF Regulatory", "Tax", "Statutory/ROC", "Other"
  ]
};
