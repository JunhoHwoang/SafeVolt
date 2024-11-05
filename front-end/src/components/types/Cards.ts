export interface Cards {
    id: string;
    severityScore: number;
    category: "HIGH" | "MEDIUM" | "LOW";
    overview: string;
    description: string;
    solution: string;
    lesson: string;
    prevention: string;
    date: string; // assuming date is a string in "YYYY-MM-DD" format
    time?: string; // if there’s a time field, include it as optional
    content?: string; // if additional content is needed
  }
  