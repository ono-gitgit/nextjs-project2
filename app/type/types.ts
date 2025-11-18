export type InputField = {
  title: string;
  type: string;
  name: string;
  id: string;
  value: string | number;
  validation: object;
};

export type StudyGoal = {
  studyGoalId: number;
  studyGoal: string;
  memo: string | null;
  deadline: string | null;
};

export type Task = {
  field: string | null;
  priority: number;
  progress: number | null;
  studyGoalId: number;
  task: string;
  taskMemo: string | null;
  taskStartDate: string;
  tsakDealline: string;
  tsakEndDate: string;
};

export type AlterTask = {
  task: string;
  field: string | null;
  priority: number;
  startDate: string | null;
  deadline: string | null;
};

// studyGoalIdをキーにしたオブジェクト型
export type GroupedTask = {
  [studyGoalId: number]: AlterTask[];
};
