/** Skill category values stored in the database (simple strings) + display labels. */
export const SKILL_CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Database",
  "AI/ML",
  "GenAI",
  "Data Science",
  "DevOps/Tools",
  "Programming",
  "Other",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORY_ORDER)[number];

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  Programming: "Programming",
  Frontend: "Frontend Development",
  Backend: "Backend Development",
  Database: "Databases",
  "AI/ML": "AI & Machine Learning",
  GenAI: "Generative AI",
  "Data Science": "Data Science",
  "DevOps/Tools": "DevOps & Tools",
  // legacy values kept working
  Languages: "Programming",
  Tools: "DevOps & Tools",
  Other: "Other",
};

/** Options for the admin category dropdown (value stored, label shown). */
export const SKILL_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "Programming", label: "Programming" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Database", label: "Database" },
  { value: "AI/ML", label: "AI / Machine Learning" },
  { value: "GenAI", label: "Generative AI" },
  { value: "Data Science", label: "Data Science" },
  { value: "DevOps/Tools", label: "DevOps / Tools" },
  { value: "Other", label: "Other" },
];

export const categoryLabel = (category: string) =>
  SKILL_CATEGORY_LABELS[category] ?? category;

export const categoryRank = (category: string) => {
  const normalized =
    category === "Languages" ? "Programming" : category === "Tools" ? "DevOps/Tools" : category;
  const i = (SKILL_CATEGORY_ORDER as readonly string[]).indexOf(normalized);
  return i === -1 ? SKILL_CATEGORY_ORDER.length : i;
};
