export interface createTask {
  task: string;
}

export interface getAllTask {
  id: string;
  task: string;
  createdAt: Date;
  updatedAt: Date;
}
