# QA Test Report — CAR-20 (SCRUM-54): View Job Details

- **Parent Story:** `CAR-20` (`SCRUM-54`) — *As a job seeker, I want to view full details of a job posting.*
- **Subtask:** `[QA] Verify job detail rendering & navigation`
- **Tester:** Ly Srongchhay (LS)
- **Files Covered:**
  - `Frontend/src/components/JobDetailsModal.jsx`
  - `Frontend/src/pages/JobFinder.jsx`
  - `Frontend/src/services/jobApi.js`
  - `backend/controllers/jobController.js` (`GET /api/jobs/:id`)


---

## 1. Automated Build Verification

| Check | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| Frontend Production Build | `npm run build` (`vite build`) | **PASS** | Built cleanly (`2207 modules transformed`, `0 errors`). |

---

## 2. Functional & UI Test Cases

| ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Open job details from job card | Navigate to `/jobs` (or `/app/jobs`) and click any job card. | `JobDetailsModal` opens, calls `GET /api/jobs/:id`, and updates URL to `?job=<id>`. | [ ] |
| **TC-02** | Render all job metadata fields | Inspect modal header and body for a job with full data. | Displays `company`, `job_type` badge, `status`, `title`, `location`, `salary_range`, `created_at`, `description`, and `requirements`. | [ ] |
| **TC-03** | Handle missing optional fields | Open a job missing `salary_range`, `requirements`, or `job_url`. | Optional badges/sections hide cleanly without UI breakage; footer shows *"Contact company directly to apply"* when `job_url` is absent. | [ ] |
| **TC-04** | Modal scroll isolation | Scroll inside `JobDetailsModal` using mouse wheel. | Only modal body scrolls; background job list remains locked (`data-lenis-prevent` + body overflow lock). | [ ] |
| **TC-05** | Close modal & preserve filters | Apply a search/filter, open a job, then close via `X`, backdrop click, or `Esc`. | Modal closes, `?job=<id>` is removed from URL, and active search/filters remain intact. | [ ] |
| **TC-06** | Bookmark toggle inside modal | Click the bookmark icon in the modal header. | Icon toggles saved state and updates the **Saved Jobs** counter. | [ ] |
| **TC-07** | Direct URL & page refresh | Open `/jobs?job=<valid-id>` or refresh while modal is open. | Automatically fetches `GET /api/jobs/:id` and opens the modal for that job. | [ ] |
| **TC-08** | Non-existent job (`404`) handling | Navigate to `/jobs?job=00000000-0000-0000-0000-000000000000`. | Modal renders the `"Job not found"` fallback state cleanly without crashing. | [ ] |
| **TC-09** | Tailor CV & Apply navigation | Click *"Tailor My CV for This Role"* and *"Apply on Company Site"*. | Navigates to `/app/builder/guest` (public) or `/app/builder` (logged in); external link opens in a new tab. | [ ] |
