import { AnswerQuestionFormat } from "@agent-xenon/constants";
import { MCQQuestion } from "./_components/MCQQuestion";
import { TextQuestion } from "./_components/TextQuestion";
import { FileQuestion } from "./_components/FileQuestion";
import { CodeQuestion } from "./_components/CodeQuestion";
import { IInterviewQuestion } from "@agent-xenon/interfaces";

interface IQuestions {
  question: IInterviewQuestion;
  answers: string | string[];
  onAnswer: (questionId: string, answer: string | string[]) => void;
}

export const Question = ({ question, onAnswer, answers }: IQuestions) => {
  switch (question.questionFormat) {
    case AnswerQuestionFormat.MCQ:
      return (
        <MCQQuestion
          question={question}
          answer={answers as string}
          onAnswer={onAnswer}
        />
      );
    case AnswerQuestionFormat.TEXT:
      return (
        <TextQuestion
          question={question}
          answer={answers as string}
          onAnswer={onAnswer}
        />
      );
    case AnswerQuestionFormat.FILE:
      return (
        <FileQuestion
          question={question}
          answer={answers as string[]}
          onAnswer={onAnswer}
        />
      );
    case AnswerQuestionFormat.CODE:
      return (
        <CodeQuestion
          question={question}
          answer={answers as string}
          onAnswer={onAnswer}
        />
      );
    default:
      return (
        <TextQuestion
          question={question}
          answer={answers as string}
          onAnswer={onAnswer}
        />
      );
  }
};
