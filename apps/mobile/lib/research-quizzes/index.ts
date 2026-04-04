import raw from './quiz-data.json';

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

export type CompetitionId = 'ymrc' | 'ysrc';

const data = raw as {
  ymrc: { id: string; name: string; abbr: string; subject: string; quizzes: ResearchQuizPaper[] };
  ysrc: { id: string; name: string; abbr: string; subject: string; quizzes: ResearchQuizPaper[] };
};

export const researchQuizData = data;
export const YMRC_QUIZZES: ResearchQuizPaper[] = data.ymrc.quizzes;
export const YSRC_QUIZZES: ResearchQuizPaper[] = data.ysrc.quizzes;

export function getQuizByCompetition(
  competition: CompetitionId,
  slug: string,
): ResearchQuizPaper | undefined {
  const quizzes = competition === 'ymrc' ? YMRC_QUIZZES : YSRC_QUIZZES;
  return quizzes.find((q) => q.slug === slug);
}

/** Mirror the web's intro-question mixing so the question order matches. */
const INTRO_QUESTION_IDS = new Set(['q1', 'q2', 'q3', 'q4']);

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i]!, next[j]!] = [next[j]!, next[i]!];
  }
  return next;
}

export function mixIntroQuestions(questions: ResearchQuestion[]): ResearchQuestion[] {
  const intro: ResearchQuestion[] = [];
  const regular: ResearchQuestion[] = [];
  for (const q of questions) {
    (INTRO_QUESTION_IDS.has(q.id) ? intro : regular).push(q);
  }
  if (!intro.length || !regular.length) return questions;
  const mixed = [...regular];
  for (const q of shuffle(intro)) {
    const insertAt = Math.floor(Math.random() * (mixed.length + 1));
    mixed.splice(insertAt, 0, q);
  }
  return mixed;
}
