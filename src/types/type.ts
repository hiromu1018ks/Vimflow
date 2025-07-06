export interface createTask {
  task: string;
}

export interface getAllTask {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface updateTask {
  task?: string;
  completed?: boolean;
}
