import { Question } from "./Question";

export interface Quiz {
    id: string;
    quizName: string;
    questions: Question[];
}
