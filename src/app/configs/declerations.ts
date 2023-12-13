export interface UserTaskCount {
    userId: number;
    userName: string;
    taskCount: number;
}

export interface User {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    name: string;
    userId: number;
    userName: string;
    subject: string;
    isCompleted: boolean;
    targetDate: Date;

}