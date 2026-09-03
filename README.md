# Tavasya Compliance Register

Every Tavasya compliance obligation — due date, status, who owns it, a link
to the filed proof — in one place. Sign in, see the register, mark things
done as you file them. A scheduled script emails whoever owns an item once
it's within 15 days of its due date, and keeps emailing daily until someone
marks it complete with proof attached.

No build step, no framework. Plain HTML/CSS/JS, Firebase for data and
login, GitHub Pages for hosting, GitHub Actions for the daily email.

**First Admin:** `aryan@tavasyacapital.in` — see Step 6 below.

---

## What's in this app

- **Dashboard** — status counts (Overdue / Due in 1 Week / Upcoming / Completed / Ongoing),
  each one clickable to filter the list below it; a distance-to-deadline
  meter; a "Tasks Due" panel you can page backward and forward by week;
  filters by scheme and by compliance type.
- **Register** — every compliance, searchable and filterable (scheme, type,
  status), with inline mark-complete and a full edit drawer.
- **Schemes tab** — add a new scheme any time (it clones every obligation
  from an existing scheme, same due dates, since these are calendar-based
  filings that apply the same way regardless of when a scheme launches).
  Archive a scheme without losing its history.
- **Compliance types** — add one inline while filling out a compliance
  form; a "Manage types" tool lets anyone reassign compliances between
  types, and lets Admin/Team Lead delete a type outright (with a
  checklist-based reassignment flow first, if anything's still using it).
- **Team tab** — three roles (see below), with a reporting line from each
  Member to a Team Lead.
- **Compliance detail popup** — Admin-only, click any row to see who owns
  it and who their Team Lead is, in one place.
- **Import from Excel** — upload your actual compliance calendar
  spreadsheet (same shape as always: one sheet per scheme, same 10
  columns) and it loads straight in, with a review step before anything
  saves. This is the recommended way to load real data — see below.
- **Light/dark toggle**, remembered across visits.
- **Daily reminder emails**, starting 15 days before a due date, escalating
  if overdue, stopping the moment something's marked complete.

---

## Roles

| Role | Can do |
|---|---|
| **Member** | See everything. Add/edit any compliance, mark things complete (with proof link). Add a new compliance type. Reassign compliances between types. |
| **Team Lead** | Everything a Member can, plus delete a compliance type. |
| **Admin** | Everything above, plus manage the Team tab (add/remove people, set roles and reporting lines), add/archive Schemes, delete a compliance row outright, and see the Compliance Detail popup. |

Every **Member**'s profile can have a **Reports to** field pointing at a
Team Lead — that's what powers the detail popup's "who's above this
person" view. Team Leads and Admins don't need one; Admin is the
implicit top of the chain.

---

## Step 1 — Create the Firebase project

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**. Name it anything (e.g. `Tavasya Compliance`). Turn off Analytics.
2. **Build → Firestore Database → Create database.** Standard edition, region `asia-south1` (Mumbai), **Production mode**.
3. **Build → Authentication → Get started → Sign-in method → Email/Password** → turn on the first toggle only (leave "Email link" off).

## Step 2 — Register the web app

1. Gear icon → **Project settings** → **Your apps** → click `</>`.
2. Nickname it anything, **Register app** — don't check "Also set up Firebase Hosting."
3. Copy the `firebaseConfig` block shown.
4. Open **`config.js`** in this codebase and paste it in — it should already show `ORG_DOMAIN = "tavasyacapital.in"`, correct as-is.

## Step 3 — Publish the security rules

1. Firebase → **Firestore Database → Rules** → delete the default content, paste in the entire contents of **`firestore.rules`** from this codebase → **Publish**.
2. The domain is already set correctly (`tavasyacapital.in`) — no edit needed unless that ever changes.

## Step 4 — Put it on GitHub Pages

1. New GitHub repository (public is fine — nothing in this codebase is a secret; see "On repo visibility" below).
2. Upload every file, **keeping the folder structure**:
   ```
   index.html, styles.css, app.js, config.js, firestore.rules, README.md, .gitignore
   data/tavasya-seed.json
   scripts/seed.js, scripts/send-reminders.js
   .github/workflows/reminders.yml
   ```
   Easiest via drag-and-drop in the GitHub web UI: for `data/` and `scripts/`
   files, edit the upload page's URL to add `/data` or `/scripts` on the end
   before dragging files in — GitHub creates the folder automatically.
3. Repo → **Settings → Pages** → Source: **Deploy from a branch**, branch `main`, folder `/ (root)` → **Save**.
4. Wait ~30 seconds. Live at `https://<org-or-username>.github.io/<repo-name>/`.

### On repo visibility

The `firebaseConfig` values are meant to be public — they identify which
Firebase project to talk to, not who can access it. Real access is
enforced entirely by `firestore.rules` (Step 3) and the domain check —
someone browsing the code or finding the live URL still hits a sign-in
wall and gets nowhere without an `@tavasyacapital.in` account that's also
been explicitly added to the team list (Step 6). A public repo is fine.
If your GitHub plan supports private repos with Pages enabled, that also
works — just be aware GitHub's free tier doesn't allow Pages on private
repos at all (the option won't appear).

## Step 5 — Let Firebase trust the live address

**Authentication → Settings → Authorised domains → Add domain** →
`<org-or-username>.github.io`.

## Step 6 — Make Aryan the first Admin

1. Firebase → **Firestore Database → Data → Start collection**.
2. Collection ID: `users`. Document ID: `aryan@tavasyacapital.in` (exact, lowercase).
3. Add these fields:

   | Field | Type | Value |
   |---|---|---|
   | `email` | string | `aryan@tavasyacapital.in` |
   | `name` | string | `Aryan` (or full name) |
   | `role` | string | `admin` |
   | `active` | **boolean** | `true` |

   Make sure `active`'s type is actually set to **boolean** — if it's left
   as a string, the app won't recognize the account as active.
4. Save. Open the live site, sign in with that address (any password —
   first sign-in creates the account and sends a confirmation email;
   confirm it, then reload). Add everyone else from the **Team** tab.

---

## Loading the real compliance data

**Recommended: use the "Import from Excel" button** (Register tab, once
signed in as Admin/Team Lead) and upload your actual, current compliance
calendar spreadsheet — the one with a sheet per scheme and the usual 10
columns. This is better than the old seed-script method below because it:

- Shows a review screen (new / updated / skipped counts) before writing anything
- Never overwrites an Owner, Link, or Compliance Type someone already set in the app
- Never reverts a confirmed completion back to incomplete because of a stale sheet
- Flags any "completed" row with no stored document link as **Proof pending**,
  rather than either blocking the import or silently hiding the gap

It's safe to run more than once as your calendar gets updated — matching
rows update in place rather than duplicating.

### Legacy option: the JSON seed script

`data/tavasya-seed.json` + `scripts/seed.js` are the original bulk-load
method from before the Excel importer existed. They still work (see the
comments inside `scripts/seed.js`) but need Node.js and a downloaded
Firebase service-account key on your computer — more setup than the
in-browser Excel import, with none of its safety checks. Only worth using
if you specifically need to script a load outside the browser.

---

## Reminder emails — Microsoft 365, no Azure app registration

Deliberately built around **SMTP AUTH directly against Outlook's mail
server**, not the Microsoft Graph API — Graph needs an Azure app
registration with admin-consented `Mail.Send` permission, which Tavasya
wanted to avoid. This path needs only a mailbox setting and a password.

### Pick the sending mailbox

Any mailbox on the tenant works — `aryan@tavasyacapital.in` itself is
fine to start with, or a dedicated one later if you'd rather reminders
not land in one person's personal inbox.

### Enable SMTP AUTH on that one mailbox

1. [admin.microsoft.com](https://admin.microsoft.com) → **Users → Active users** → click the sending mailbox.
2. **Mail** tab → **Manage email apps** → turn on **Authenticated SMTP**.

This is a per-mailbox checkbox, not an app registration — the whole
point of this approach.

### Get a password for the script to use

- **If that mailbox has MFA off:** its normal password works, though an
  App Password is still safer since it's revocable independently.
- **If MFA is on (likely, and recommended to leave on):** generate an
  **App Password** — [mysignins.microsoft.com/security-info](https://mysignins.microsoft.com/security-info)
  → **Add sign-in method** → **App password**. If that option doesn't
  appear, your tenant's Security Defaults or a Conditional Access policy
  may be blocking app passwords or basic auth outright — your Microsoft
  365 admin can allow it specifically for this one mailbox, which is a
  narrower ask than a full Azure app registration.

### Add the secrets to GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full contents of a Firebase service-account key (Firebase → Project settings → Service accounts → **Generate new private key**), pasted as one block. **Never commit this file to the repo.** |
| `MS365_EMAIL` | The sending mailbox's address |
| `MS365_APP_PASSWORD` | The App Password (or account password) from above |

### Test it

**Actions tab → Daily compliance reminders → Run workflow** to trigger it
without waiting for 9am. Check the run's log — it prints who it sent to
and how many items each got. "Nothing due — no mail sent" on a quiet day
is expected, not a failure.

Once confirmed working, it runs itself daily at 9:00 IST.

---

## How completion works

Marking anything complete — from the quick checkbox in the Register, or
from the Add/Edit drawer — **requires a link to the filed document**
(OneDrive, SharePoint, wherever it's actually stored). No link, no
completion; this applies at every role level, no exceptions. This is
enforced in the app's own logic, so it holds regardless of who's marking
something done.

**Exception:** rows brought in via Excel import that were already marked
done in the spreadsheet but have no stored link get imported as complete
with a **"Proof pending"** tag instead of being blocked or silently
treated as fully resolved. Open one of those from the Register or Detail
popup and add the link when you have it — the tag disappears once it's set.

---

## Adding Hyperion later

This deployment is Tavasya-only, deliberately. When Hyperion is ready:

- **Separate Firebase project** (repeat Steps 1–6 above under a fresh
  project) if the two funds' data and access should be fully apart — the
  simpler, more isolated option.
- **Same project, a `fund` field** added to every compliance plus a fund
  filter in the Register, if you'd rather manage both from one place.
  Reuses every file here unchanged except `config.js`'s `ORG_DOMAIN` if
  Hyperion's team uses a different email domain.

Worth deciding once this deployment's been in daily use for a while, not upfront.

---

## If something goes wrong

| Symptom | Likely cause |
|---|---|
| "Missing or insufficient permissions" | Rules not published, or a `users` doc's ID isn't the exact lowercase email, or `active` saved as text `"true"` instead of boolean `true` |
| Confirmation email never arrives | Check spam; confirm the GitHub Pages domain is in Authorised domains (Step 5) |
| Reminder emails don't arrive | Check the Actions tab log first. Common causes: SMTP AUTH not enabled on the mailbox, wrong App Password, a secret name typo, or every item genuinely outside its reminder window |
| Register looks empty after setup | Nothing's been imported yet — use "Import from Excel" |
| Excel import says "no scheme sheets recognized" | The file's column headers or per-sheet layout don't match the expected 10-column shape — check against a known-good calendar file |
| "Import from register" (legacy) overwrote things unexpectedly | Prefer "Import from Excel" going forward — it has the overwrite protections the legacy JSON importer doesn't |

## What this costs

Nothing at this scale. Firebase's free tier covers far more reads/writes
than a small team checking a few-hundred-row register generates. GitHub
Pages and Actions are free for a repository this size. The Microsoft 365
SMTP calls cost nothing beyond the existing license.
