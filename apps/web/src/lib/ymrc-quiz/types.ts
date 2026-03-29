export type YmrcQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export type YmrcQuizSet = {
  slug: string;
  label: string;
  subtitle: string;
  questions: YmrcQuestion[];
};

export type YmrcQuizDataFile = {
  quizzes: YmrcQuizSet[];
};
