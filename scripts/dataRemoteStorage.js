let standartTasks = [
  {
    id: 0,
    title: "Remember Theme Across Sessions",
    description:
      "As a user, I want the website to remember my selected theme even after I close the browser.",
    priority: "Medium",
    status: "toDo",
    dueDate: "2024-04-16",
    subtasks: [
      { title: "Save selected theme in localStorage", done: true },
      { title: "Save selected theme in localStorage", done: false },
      { title: "Load and apply theme on page load", done: false },
    ],
    assigned: [
      { name: "Thomas Müller", color: "#FF7A00" },
      { name: "Max Mustermann", color: "#FF5EB3" },
    ],
    category: "User Story",
    colorTo: ["#FF7A00", "#FF5EB3"],
  },
  {
    id: 1,
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation.",
    priority: "Low",
    status: "inProgress",
    dueDate: "2024-04-16",
    subtasks: [
      { title: "mplement Recipe Recommendation", done: true },
      { title: "Start page Layout", done: false },
    ],
    assigned: [
      { name: "Marianne Musterfrau", color: "#9327FF" },
      { name: "Mark Zuckerberg", color: "#FF745E" },
    ],
    category: "User Story",
    colorTo: ["#9327FF", "#FF745E"],
  },
  {
    id: 2,
    title: "User Feedback on Theme Change",
    description:
      "As a user, I want to receive a visual confirmation when I switch themes.",
    priority: "Urgent",
    status: "awaitFeedback",
    dueDate: "2025-06-20",
    subtasks: [
      { title: "Display toast or icon when theme is changed", done: true },
      { title: "Ensure message does not interrupt interaction", done: false },
    ],
    assigned: [
      { name: "Bill Gates", color: "#0038FF" },
      { name: "Developer Akademie", color: "#FF745E" },
    ],
    category: "Technical Task",
    colorTo: ["#0038FF", "#FF745E"],
  },
  {
    id: 3,
    title: "Refactor Theme Toggle Logic",
    description:
      "Improve code maintainability by extracting theme toggle functionality into a reusable and testable module.",
    priority: "Medium",
    status: "done",
    dueDate: "2024-04-16",
    subtasks: [
      { title: "mplement Recipe Recommendation", done: true },
      { title: "Remove duplicate code from components", done: true },
      { title: "Add unit tests for toggle function", done: true },
      { title: "Ensure compatibility with all themes", done: true },
    ],
    assigned: [
      { name: "Alex Schöfer", color: "#1FD7C1" },
      { name: "Max Mustermann", color: "#FF5EB3" },
      { name: "Nikolaos Loukataris", color: "#C3FF2B" },
    ],
    category: "Technical Task",
    colorTo: ["#1FD7C1"],
  },
  {
    id: 4,
    title: "Add Theme Support in CSS Variables",
    description:
      "Description: Implement CSS variables for easier theming and consistent styling between dark and light modes.",
    priority: "Low",
    status: "toDo",
    dueDate: "2024-04-16",
    subtasks: [
      { title: "mplement Recipe Recommendation", done: true },
      { title: "Define CSS variables for colors and fonts", done: true },
      { title: "Update existing styles to use variables", done: false },
      { title: "Test styles in both themes", done: false },
    ],
    assigned: [
      { name: "Certan Viorel", color: "#FFE62B" },
      { name: "Nikolaos Loukataris", color: "#C3FF2B" },
      { name: "Branislav Bardon", color: "#FF7A00" },
    ],
    category: "Technical Task",
    colorTo: ["#FFE62B", "#C3FF2B", "#FF7A00"],
  },
];


let contactsDummy = [
  {
    name: "Thomas Müller",
    email: "thomas@mueller.de",
    phone: "+49 111 222 333",
    initial: "TM",
    profilcolor: "#FF7A00",
  },
  {
    name: "Max Mustermann",
    email: "max@mustermann.de",
    phone: "+49 111 222 334",
    initial: "MM",
    profilcolor: "#FF5EB3",
  },
  {
    name: "Marianne Musterfrau",
    email: "marianne@musterfrau.de",
    phone: "+49 111 222 335",
    initial: "MM",
    profilcolor: "#9327FF",
  },
  {
    name: "Mark Zuckerberg",
    email: "mark@zuckerberg.com",
    phone: "+1 111 222 336",
    initial: "MZ",
    profilcolor: "#FF745E",
  },
  {
    name: "Bill Gates",
    email: "bill@gates.com",
    phone: "+1 111 222 337",
    initial: "BG",
    profilcolor: "#0038FF",
  },
  {
    name: "Developer Akademie",
    email: "info@developerakademie.com",
    initial: "DA",
    profilcolor: "#FF745E",
  },

  {
    name: "Alex Schöfer",
    email: "alex@schoefer.de",
    phone: "+49 222 222 221",
    initial: "AS",
    profilcolor: "#1FD7C1",
  },
  {
    name: "Certan Viorel",
    email: "certan@viorel.de",
    phone: "+49 222 222 222",
    initial: "CV",
    profilcolor: "#FFE62B",
  },
  {
    name: "Nikolaos Loukataris",
    email: "nikolaos@loukataris.at",
    phone: "+49 222 222 223",
    initial: "NL",
    profilcolor: "#C3FF2B",
  },
  {
    name: "Branislav Bardon",
    email: "bransilav@bardon.de",
    phone: "+49 222 222 224",
    initial: "BB",
    profilcolor: "#FF7A00",
  },
];
