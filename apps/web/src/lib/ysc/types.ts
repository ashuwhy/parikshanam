export type YscCertificateType = "merit" | "participation";

export type YscStudentRecord = {
  name: string;
  rollNo: string;
  contact: string;
  score: string;
  class: string;
  subject: string;
  certificateType: YscCertificateType;
};
