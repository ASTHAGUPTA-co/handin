import { addDays, toDateKey } from '../utils/dates'

export const USERS = [
  { id: 'p1', name: 'Prof. Meera Iyer', role: 'admin', title: 'Data Structures', color: '#d9480f' },
  { id: 'p2', name: 'Prof. Arjun Rao', role: 'admin', title: 'Web Technologies', color: '#7048e8' },
  { id: 's1', name: 'Aarav Sharma', role: 'student', title: 'B.Tech, Year 2', color: '#0c8599' },
  { id: 's2', name: 'Diya Patel', role: 'student', title: 'B.Tech, Year 2', color: '#c2255c' },
  { id: 's3', name: 'Kabir Singh', role: 'student', title: 'B.Tech, Year 2', color: '#2f9e44' },
  { id: 's4', name: 'Isha Verma', role: 'student', title: 'B.Tech, Year 2', color: '#e8590c' },
  { id: 's5', name: 'Rohan Das', role: 'student', title: 'B.Tech, Year 2', color: '#364fc9' },
]

export function buildSeedData(now = new Date()) {
  const day = (n) => toDateKey(addDays(now, n))
  const ago = (n) => addDays(now, -n).toISOString()

  const assignments = [
    {
      id: 'a1',
      adminId: 'p1',
      title: 'Linked List Playground',
      description: 'Implement singly and doubly linked lists in C++ with insert, delete and reverse. Include a short note on the time complexity of each operation.',
      dueDate: day(-3),
      driveLink: 'https://drive.google.com/drive/folders/linked-list-playground',
      assignedTo: 'all',
      createdAt: ago(12),
    },
    {
      id: 'a2',
      adminId: 'p1',
      title: 'Binary Trees on Paper',
      description: 'Solve the 8 traversal and construction problems from the worksheet by hand. Scan and upload as a single PDF.',
      dueDate: day(1),
      driveLink: 'https://drive.google.com/drive/folders/binary-trees',
      assignedTo: 'all',
      createdAt: ago(7),
    },
    {
      id: 'a3',
      adminId: 'p1',
      title: 'Graph Search Mini Project',
      description: 'Build a maze solver using BFS and DFS and compare how many nodes each one visits. Short write-up with screenshots please.',
      dueDate: day(6),
      driveLink: 'https://drive.google.com/drive/folders/graph-search',
      assignedTo: ['s1', 's2', 's3'],
      createdAt: ago(4),
    },
    {
      id: 'a4',
      adminId: 'p1',
      title: 'Hashing Reflection',
      description: 'One page: when would you pick a hash map over a balanced tree, and when would you not? Use an example from something you have built.',
      dueDate: day(12),
      driveLink: 'https://drive.google.com/drive/folders/hashing-reflection',
      assignedTo: 'all',
      createdAt: ago(1),
    },
    {
      id: 'a5',
      adminId: 'p2',
      title: 'Personal Portfolio Page',
      description: 'Build a responsive one-page portfolio with plain HTML and CSS. No frameworks yet. Host it on GitHub Pages and share the link.',
      dueDate: day(-1),
      driveLink: 'https://drive.google.com/drive/folders/portfolio-page',
      assignedTo: 'all',
      createdAt: ago(10),
    },
    {
      id: 'a6',
      adminId: 'p2',
      title: 'Fetch API Quiz App',
      description: 'A small quiz app that loads questions from a public API, tracks the score and handles failed requests gracefully.',
      dueDate: day(3),
      driveLink: 'https://drive.google.com/drive/folders/fetch-quiz',
      assignedTo: ['s2', 's4', 's5'],
      createdAt: ago(5),
    },
    {
      id: 'a7',
      adminId: 'p2',
      title: 'Accessibility Audit',
      description: 'Pick any website, run it through Lighthouse and WAVE, and write up 5 fixes you would make. Screenshots of before and after are welcome.',
      dueDate: day(9),
      driveLink: 'https://drive.google.com/drive/folders/a11y-audit',
      assignedTo: 'all',
      createdAt: ago(2),
    },
  ]

  const submissions = [
    // linked lists: most of the class is done, Kabir and Rohan are late
    { assignmentId: 'a1', studentId: 's1', submittedAt: ago(5) },
    { assignmentId: 'a1', studentId: 's2', submittedAt: ago(4) },
    { assignmentId: 'a1', studentId: 's4', submittedAt: ago(3) },
    // binary trees: Diya is early
    { assignmentId: 'a2', studentId: 's2', submittedAt: ago(1) },
    // portfolio
    { assignmentId: 'a5', studentId: 's1', submittedAt: ago(2) },
    { assignmentId: 'a5', studentId: 's3', submittedAt: ago(1) },
    { assignmentId: 'a5', studentId: 's4', submittedAt: ago(2) },
    { assignmentId: 'a5', studentId: 's5', submittedAt: ago(1) },
    // fetch quiz
    { assignmentId: 'a6', studentId: 's5', submittedAt: ago(0) },
  ]

  return { version: 1, assignments, submissions }
}
