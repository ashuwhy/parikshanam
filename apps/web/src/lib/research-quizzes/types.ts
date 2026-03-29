export type ResearchQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export type ResearchQuizPaper = {
  slug: string;
  label: string;
  subtitle: string;
  questionCount: number;
  questions: ResearchQuestion[];
};

export type ResearchCompetition = {
  id: string;
  name: string;
  abbr: string;
  subject: string;
  quizzes: ResearchQuizPaper[];
};

export type ResearchQuizDocument = {
  version: number;
  generatedAt: string;
  ymrc: ResearchCompetition;
  ysrc: ResearchCompetition;
};
