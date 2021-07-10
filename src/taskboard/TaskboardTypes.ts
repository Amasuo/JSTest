export interface TaskboardItem {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: Number;
}

export enum TaskboardItemStatus {
  //TO_DO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}
