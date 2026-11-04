# 📌 Handin

A small assignment and review dashboard for professors and students. Professors create assignments and watch the class complete them; students see what's due and confirm when they've submitted. Built for the Joineazy Frontend Intern assignment (Task 1).

**Live demo:** _add your Vercel/Netlify link_
**Demo video:** _add your Loom link_

No backend and no passwords. Everything is stored in `localStorage`, so data survives a refresh.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests (vitest)
npm run build    # production build into dist/
```

Needs Node 18+.

## Try it out

The login screen lists 2 professors and 5 students. Pick anyone.

- **Prof. Meera Iyer** or **Prof. Arjun Rao**: create, edit and delete assignments, choose the audience, expand any card to see each student's status.
- **Aarav, Diya, Kabir, Isha, Rohan**: submit assignments with the two-step confirmation. Open another professor/student afterwards to see the numbers update.
- **Reset demo** (header, desktop) wipes localStorage back to the seed data. Seed due dates are generated relative to the day you first open the app, so there is always a mix of overdue, due soon and later work.

## Folder structure

```
src/
├── components/
│   ├── admin/        AssignmentForm, AssignmentPanel
│   ├── student/      AssignmentCard
│   ├── layout/       Header
│   └── ui/           Modal, ConfirmDialog, Button, ProgressBar, ProgressRing,
│                     StatusBadge, FilterBar, ThemeToggle, Avatar, States
├── context/          AuthContext, DataContext
├── data/             seed.js (users + starting assignments)
├── hooks/            useLocalStorage
├── pages/            Login, StudentDashboard, AdminDashboard
├── utils/            dates.js, assignments.js (+ tests)
├── App.jsx
└── main.jsx
```

## Component architecture

```
<AuthProvider>            who is logged in (session id kept in localStorage)
  <DataProvider>          assignments + submissions, loading/error state, all mutations
    <Shell>
      ├─ <Login />                       no user yet
      └─ <Header /> + one of:
           ├─ <StudentDashboard />       ProgressRing, FilterBar, AssignmentCard[]
           │                              └─ ConfirmDialog (final submit step)
           └─ <AdminDashboard />         FilterBar, AssignmentPanel[], AssignmentForm
                                          ├─ ProgressBar + student status list
                                          └─ ConfirmDialog (delete)
```

Pages own the filtering and sorting state. Cards and panels are mostly presentational and receive data and callbacks as props. The only components that read from context are the pages and the header.

## Key design decisions

**Data model.** Three things: users (static), assignments, and submissions. A submission is just `{ assignmentId, studentId, submittedAt }`. Status is never stored; it's computed (`submitted`, `overdue` or `pending`). That way a deadline passing, or a student being un-assigned, can never leave a stale "status" field behind.

**`assignedTo: "all" | [ids]`.** "All students" is stored as a flag, not a copy of every id, so it stays correct if the class changes. If a professor narrows an audience while editing, submissions from students who are no longer assigned are removed.

**Visibility rules live in one place.** Students only get `assignments.filter(isAssignedTo)`, admins only get `assignments.filter(a => a.adminId === user.id)`. Both are done at the top of their page, so no card can accidentally show someone else's data.

**Two contexts, not one.** Auth and data change for different reasons, and splitting them means logging in/out doesn't re-render consumers of the data and vice versa. I kept it to plain Context + `useState` since the state is small. A reducer or Zustand would be overkill here.

**Mock "API" behaviour.** `DataProvider` reads from localStorage after a short fake delay, so the loading skeleton is real, not decorative. If the saved JSON is corrupted it shows an error screen with "Try again" and "Reset demo data" instead of a blank page. (Easy to see: set `handin:data` to `garbage` in dev tools and refresh.)

**Dates are date-only strings.** `<input type="date">` gives `YYYY-MM-DD`, and a due date means "end of that day, local time". `new Date('2026-11-05')` parses as UTC and can be a day off, so `utils/dates.js` parses the parts by hand. This is covered by tests.

**Two-step submission.** The card asks "Uploaded your work to the Drive folder?" → **Yes, I have submitted** → a final confirmation dialog explaining it can't be undone → status flips to Submitted. Late submissions are allowed but the button says "(late)".

**Accessibility.** Hand-written modal with focus trap, Esc to close, focus returned to the trigger and scroll lock. Form fields have labels and `aria-invalid`/`aria-describedby` errors. Status badges use an icon + text, not only colour. Progress bars have `role="progressbar"`. Animations are disabled under `prefers-reduced-motion`.

**Look and feel.** I deliberately avoided the default indigo-and-grey dashboard look. It uses a warm paper-like palette, a serif display font (Fraunces) for headings and a single burnt-orange accent. Dark mode is a manual toggle that also respects the system preference on first visit, and the theme is set in `index.html` before first paint to avoid a white flash.

## Bonus items covered

Search, status/completion filter, sort by due date, overdue highlighting, dark mode, small animations, keyboard navigation and labels, and unit tests for the business logic.

## What I'd do next

- Component tests with React Testing Library for the submit flow and the form validation
- TypeScript types for `Assignment`, `Submission` and `User`
- Real "submit proof" (file upload) rather than self-reported status
- Pagination or virtualisation once a class has hundreds of assignments
