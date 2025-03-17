import { Dispatch, SetStateAction } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayMove,
  UseFormReturn,
} from "react-hook-form";

import { type QuestionFormValues } from "./index";

export function handleQuestionTypeChange(
  form: UseFormReturn<QuestionFormValues>,
  index: number,
  value: any
) {
  switch (value) {
    case "multiple_choice":
      form.setValue(`questions.${index}`, {
        ...form.getValues(`questions.${index}`),
        questionType: value,
        options: [
          { id: `option-${index}-1`, text: "" },
          { id: `option-${index}-2`, text: "" },
        ],
        correctAnswer: [],
      });
      break;

    case "true_false":
      form.setValue(`questions.${index}`, {
        ...form.getValues(`questions.${index}`),
        questionType: value,
        correctAnswer: false,
      });
      break;

    case "short_answer":
      form.setValue(`questions.${index}`, {
        ...form.getValues(`questions.${index}`),
        questionType: value,
        correctAnswer: [""],
        caseSensitive: false,
      });
      break;

    case "matching":
      form.setValue(`questions.${index}`, {
        ...form.getValues(`questions.${index}`),
        questionType: value,
        options: [
          { id: `pair-${index}-1`, prompt: "", match: "" },
          { id: `pair-${index}-2`, prompt: "", match: "" },
        ],
        correctAnswer: {},
      });
      break;

    case "fill_in_blank":
      form.setValue(`questions.${index}`, {
        ...form.getValues(`questions.${index}`),
        questionType: value,
        options: [
          { id: `blank-${index}-1`, correctAnswer: "", caseSensitive: false },
        ],
        correctAnswer: {},
      });
      break;
  }
}

// Utilities for multiple choice question

export function addMultipleChoiceOption(
  form: UseFormReturn<QuestionFormValues>,
  questionIndex: number
) {
  const question = form.getValues(`questions.${questionIndex}`);
  if (question.questionType !== "multiple_choice") return;

  const options = question.options || [];

  form.setValue(`questions.${questionIndex}.options`, [
    ...options,
    { id: `option-${questionIndex}-${options.length + 1}`, text: "" },
  ]);
}

export function addQuestion(
  append: UseFieldArrayAppend<QuestionFormValues, "questions">,
  fields: FieldArrayWithId<QuestionFormValues, "questions", "id">[],
  expandedQuestions: string[],
  setExpandedQuestions: Dispatch<SetStateAction<string[]>>
) {
  append({
    questionText: "",
    questionType: "multiple_choice",
    explanation: "",
    points: 1,
    isRequired: true,
    options: [
      { id: `option-${fields.length}-1`, text: "" },
      { id: `option-${fields.length}-2`, text: "" },
    ],
    correctAnswer: [],
  });

  // Expand the newly added question
  setExpandedQuestions([...expandedQuestions, `question-${fields.length}`]);
}

export function moveQuestionUp(index: number, move: UseFieldArrayMove) {
  if (index > 0) {
    move(index, index - 1);
  }
}

export function moveQuestionDown(
  index: number,
  move: UseFieldArrayMove,
  fields: FieldArrayWithId<QuestionFormValues, "questions", "id">[]
) {
  if (index < fields.length - 1) {
    move(index, index + 1);
  }
}

export function removeOption(
  questionIndex: number,
  optionIndex: number,
  form: UseFormReturn<QuestionFormValues>
) {
  const question = form.getValues(`questions.${questionIndex}`);

  let options;

  if (question.questionType === "multiple_choice") {
    options = question.options as { id: string; text: string }[];

    form.setValue(
      `questions.${questionIndex}.options`,
      options.filter((_, i) => i !== optionIndex)
    );

    // If removing a correct option, also update correctAnswer array
    const correctAnswers = form.getValues(
      `questions.${questionIndex}.correctAnswer`
    ) as string[];
    const optionId = options[optionIndex].id;

    if (correctAnswers.includes(optionId)) {
      form.setValue(
        `questions.${questionIndex}.correctAnswer`,
        correctAnswers.filter((id) => id !== optionId)
      );
    }
  } else if (question.questionType === "matching") {
    options = question.options as {
      id: string;
      prompt: string;
      match: string;
    }[];

    form.setValue(
      `questions.${questionIndex}.options`,
      options.filter((_, i) => i !== optionIndex)
    );
  } else if (question.questionType === "fill_in_blank") {
    options = question.options as {
      id: string;
      correctAnswer: string;
      caseSensitive?: boolean;
    }[];

    form.setValue(
      `questions.${questionIndex}.options`,
      options.filter((_, i) => i !== optionIndex)
    );
  }
}

// Utilities for matching question
export function addMatchingPair(
  questionIndex: number,
  form: UseFormReturn<QuestionFormValues>
) {
  const question = form.getValues(`questions.${questionIndex}`);
  if (question.questionType !== "matching") return;

  const pairs = question.options || [];
  form.setValue(`questions.${questionIndex}.options`, [
    ...pairs,
    {
      id: `pair-${questionIndex}-${pairs.length + 1}`,
      prompt: "",
      match: "",
    },
  ]);
}

// Utilities for fill-in-blank question
export function addBlank(
  questionIndex: number,
  form: UseFormReturn<QuestionFormValues>
) {
  const question = form.getValues(`questions.${questionIndex}`);
  if (question.questionType !== "fill_in_blank") return;

  const blanks = question.options || [];

  form.setValue(`questions.${questionIndex}.options`, [
    ...blanks,
    {
      id: `blank-${questionIndex}-${blanks.length + 1}`,
      correctAnswer: "",
      caseSensitive: false,
    },
  ]);
}
