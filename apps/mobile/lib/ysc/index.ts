import studentsRaw from './students.json';

export type YscCertificateType = 'merit' | 'participation';

export type YscStudentRecord = {
  name: string;
  rollNo: string;
  contact: string;
  score: string;
  class: string;
  subject: string;
  certificateType: YscCertificateType;
};

export const YSC_STUDENTS: YscStudentRecord[] = studentsRaw as YscStudentRecord[];

function normalize(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, ' ');
}

export function findStudentsByNameQuery(query: string): YscStudentRecord[] {
  const q = normalize(query);
  if (!q) return [];
  return YSC_STUDENTS.filter((s) => normalize(s.name).includes(q));
}
