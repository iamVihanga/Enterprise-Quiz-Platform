"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, ImageIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { questionTypes, type SelectQuiz } from "@/db/schema";
import {
  addQuestionSchema,
  type AddQuestionInput,
} from "@/features/quizzes/schemas/zod-quiz-schema";

// Type for our form values
export type QuestionFormValues = {
  questions: AddQuestionInput[];
};

interface QuizQuestionFormProps {
  quizData: SelectQuiz;
  onBack: () => void;
}

export function QuizQuestionForm({ quizData, onBack }: QuizQuestionFormProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(
      z.object({
        questions: z
          .array(addQuestionSchema)
          .min(1, "Add at least one question"),
      })
    ),
    defaultValues: {
      questions: [
        {
          questionText: "",
          questionType: "multiple_choice",
          explanation: "",
          points: 1,
          isRequired: true,
          options: [
            { id: "option-1", text: "" },
            { id: "option-2", text: "" },
          ],
          correctAnswer: [],
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addMultipleChoiceOption = (questionIndex: number) => {
    const question = form.getValues(`questions.${questionIndex}`);
    if (question.questionType !== "multiple_choice") return;

    const options = question.options || [];

    form.setValue(`questions.${questionIndex}.options`, [
      ...options,
      { id: `option-${questionIndex}-${options.length + 1}`, text: "" },
    ]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
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
  };

  const addMatchingPair = (questionIndex: number) => {
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
  };

  const addBlank = (questionIndex: number) => {
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
  };

  const addQuestion = () => {
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
  };

  const moveQuestionUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const moveQuestionDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  const onSubmit = (data: QuestionFormValues) => {
    console.log("Quiz setup:", quizData);
    console.log("Questions:", data);
    // Here you would normally call your API to save both quiz and questions
    alert("Quiz created successfully!");
  };

  const toggleQuestion = (value: string) => {
    setExpandedQuestions(
      expandedQuestions.includes(value)
        ? expandedQuestions.filter((item) => item !== value)
        : [...expandedQuestions, value]
    );
  };

  const handleQuestionTypeChange = (index: number, value: any) => {
    // Clear existing options and setup structure based on question type
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {`Questions for "${quizData?.title || "New Quiz"}"`}
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        <Accordion
          type="multiple"
          value={expandedQuestions}
          onValueChange={setExpandedQuestions}
          className="w-full space-y-4"
        >
          {fields.map((field, index) => (
            <Card key={field.id} className="border">
              <AccordionItem
                value={`question-${index}`}
                className="border-none overflow-hidden"
              >
                <AccordionTrigger
                  className={`px-6 py-4 hover:no-underline ${
                    expandedQuestions.includes(`question-${index}`)
                      ? "bg-foreground/5"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-left">
                      Question {index + 1}:{" "}
                      {form.watch(`questions.${index}.questionText`)
                        ? form.watch(`questions.${index}.questionText`).length >
                          40
                          ? form
                              .watch(`questions.${index}.questionText`)
                              .substring(0, 40) + "..."
                          : form.watch(`questions.${index}.questionText`)
                        : "New Question"}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground text-sm capitalize">
                        {form
                          .watch(`questions.${index}.questionType`)
                          .replace("_", " ")}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({form.watch(`questions.${index}.points`)}{" "}
                        {form.watch(`questions.${index}.points`) === 1
                          ? "point"
                          : "points"}
                        )
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.questionText`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Text</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your question here"
                                className="min-h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`questions.${index}.questionType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              handleQuestionTypeChange(index, value);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {questionTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questions.${index}.points`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Points awarded for correct answer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questions.${index}.mediaUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media URL (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="ml-2"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Add an image or video to your question
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.explanation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Explanation (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide an explanation for the correct answer"
                                className="min-h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This will be shown to students after they submit
                              their answer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`questions.${index}.isRequired`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Required Question</FormLabel>
                            <FormDescription>
                              Students must answer this question to complete the
                              quiz
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Question Type Specific Options */}
                    <div className="md:col-span-2 border p-4 rounded-md">
                      <h4 className="font-medium mb-4">Answer Options</h4>

                      {/* Multiple Choice Options */}
                      {form.watch(`questions.${index}.questionType`) ===
                        "multiple_choice" && (
                        <>
                          <div className="space-y-3 mb-4">
                            {(
                              form.watch(`questions.${index}.options`) || []
                            ).map((option, optionIndex) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  checked={
                                    Array.isArray(
                                      form.watch(
                                        `questions.${index}.correctAnswer`
                                      )
                                    ) &&
                                    form
                                      .watch(`questions.${index}.correctAnswer`)
                                      .includes(option.id)
                                  }
                                  onCheckedChange={(checked) => {
                                    const currentAnswers = Array.isArray(
                                      form.watch(
                                        `questions.${index}.correctAnswer`
                                      )
                                    )
                                      ? [
                                          ...form.watch(
                                            `questions.${index}.correctAnswer`
                                          ),
                                        ]
                                      : [];

                                    if (checked) {
                                      form.setValue(
                                        `questions.${index}.correctAnswer`,
                                        [...currentAnswers, option.id]
                                      );
                                    } else {
                                      form.setValue(
                                        `questions.${index}.correctAnswer`,
                                        currentAnswers.filter(
                                          (id) => id !== option.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Input
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={
                                    form.watch(
                                      `questions.${index}.options.${optionIndex}.text`
                                    ) || ""
                                  }
                                  onChange={(e) => {
                                    form.setValue(
                                      `questions.${index}.options.${optionIndex}.text`,
                                      e.target.value
                                    );
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeOption(index, optionIndex)
                                  }
                                  disabled={
                                    (
                                      form.watch(
                                        `questions.${index}.options`
                                      ) || []
                                    ).length <= 2
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addMultipleChoiceOption(index)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </>
                      )}

                      {/* True/False Options */}
                      {form.watch(`questions.${index}.questionType`) ===
                        "true_false" && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={
                                form.watch(
                                  `questions.${index}.correctAnswer`
                                ) === true
                              }
                              onCheckedChange={() => {
                                form.setValue(
                                  `questions.${index}.correctAnswer`,
                                  true
                                );
                              }}
                            />
                            <span>True</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={
                                form.watch(
                                  `questions.${index}.correctAnswer`
                                ) === false
                              }
                              onCheckedChange={() => {
                                form.setValue(
                                  `questions.${index}.correctAnswer`,
                                  false
                                );
                              }}
                            />
                            <span>False</span>
                          </div>
                        </div>
                      )}

                      {/* Short Answer Options */}
                      {form.watch(`questions.${index}.questionType`) ===
                        "short_answer" && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`questions.${index}.correctAnswer.0`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Correct Answer</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter the correct answer"
                                    {...field}
                                    onChange={(e) => {
                                      form.setValue(
                                        `questions.${index}.correctAnswer.0`,
                                        e.target.value
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Student response must match this exactly
                                  (considering case sensitivity setting)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`questions.${index}.caseSensitive`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Case Sensitive</FormLabel>
                                  <FormDescription>
                                    Require exact capitalization match
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {/* Matching Options */}
                      {form.watch(`questions.${index}.questionType`) ===
                        "matching" && (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <FormLabel>Items</FormLabel>
                            </div>
                            <div>
                              <FormLabel>Matches</FormLabel>
                            </div>
                          </div>
                          <div className="space-y-3 mb-4">
                            {(
                              form.watch(`questions.${index}.options`) || []
                            ).map((pair, pairIndex) => (
                              <div
                                key={pair.id}
                                className="grid grid-cols-2 gap-2 items-center"
                              >
                                <Input
                                  placeholder={`Item ${pairIndex + 1}`}
                                  value={
                                    form.watch(
                                      `questions.${index}.options.${pairIndex}.prompt`
                                    ) || ""
                                  }
                                  onChange={(e) => {
                                    form.setValue(
                                      `questions.${index}.options.${pairIndex}.prompt`,
                                      e.target.value
                                    );

                                    // Update correctAnswer mapping
                                    const currentCorrectAnswer =
                                      form.watch(
                                        `questions.${index}.correctAnswer`
                                      ) || {};
                                    form.setValue(
                                      `questions.${index}.correctAnswer`,
                                      {
                                        ...currentCorrectAnswer,
                                        [pair.id]: pair.match || "",
                                      }
                                    );
                                  }}
                                />
                                <div className="flex gap-2">
                                  <Input
                                    placeholder={`Match ${pairIndex + 1}`}
                                    value={
                                      form.watch(
                                        `questions.${index}.options.${pairIndex}.match`
                                      ) || ""
                                    }
                                    onChange={(e) => {
                                      form.setValue(
                                        `questions.${index}.options.${pairIndex}.match`,
                                        e.target.value
                                      );

                                      // Update correctAnswer mapping
                                      const currentCorrectAnswer =
                                        form.watch(
                                          `questions.${index}.correctAnswer`
                                        ) || {};
                                      form.setValue(
                                        `questions.${index}.correctAnswer`,
                                        {
                                          ...currentCorrectAnswer,
                                          [pair.id]: e.target.value,
                                        }
                                      );
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeOption(index, pairIndex)
                                    }
                                    disabled={
                                      (
                                        form.watch(
                                          `questions.${index}.options`
                                        ) || []
                                      ).length <= 2
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addMatchingPair(index)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Pair
                          </Button>
                        </>
                      )}

                      {/* Fill in the Blank Options */}
                      {form.watch(`questions.${index}.questionType`) ===
                        "fill_in_blank" && (
                        <>
                          <div className="space-y-4 mb-4">
                            {(
                              form.watch(`questions.${index}.options`) || []
                            ).map((blank, blankIndex) => (
                              <div key={blank.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FormLabel className="w-24">
                                    Blank {blankIndex + 1}
                                  </FormLabel>
                                  <Input
                                    placeholder="Correct answer"
                                    value={
                                      form.watch(
                                        `questions.${index}.options.${blankIndex}.correctAnswer`
                                      ) || ""
                                    }
                                    onChange={(e) => {
                                      form.setValue(
                                        `questions.${index}.options.${blankIndex}.correctAnswer`,
                                        e.target.value
                                      );

                                      // Update correctAnswer mapping
                                      const currentCorrectAnswer =
                                        form.watch(
                                          `questions.${index}.correctAnswer`
                                        ) || {};
                                      form.setValue(
                                        `questions.${index}.correctAnswer`,
                                        {
                                          ...currentCorrectAnswer,
                                          [blank.id]: e.target.value,
                                        }
                                      );
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeOption(index, blankIndex)
                                    }
                                    disabled={
                                      (
                                        form.watch(
                                          `questions.${index}.options`
                                        ) || []
                                      ).length <= 1
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`questions.${index}.options.${blankIndex}.caseSensitive`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 ml-24">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>Case Sensitive</FormLabel>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                          <FormDescription className="mb-4">
                            Use {"{}"} in your question text to indicate where
                            blanks should appear.
                          </FormDescription>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addBlank(index)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Blank
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Question
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestionUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Move Up
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestionDown(index)}
                        disabled={index === fields.length - 1}
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Move Down
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
        {fields.length === 0 && (
          <Card className="border-dashed border-2 p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No questions yet</p>
              <Button type="button" onClick={addQuestion} className="mx-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Question
              </Button>
            </div>
          </Card>
        )}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Quiz Setup
          </Button>
          <Button type="submit" disabled={fields.length === 0}>
            Save Quiz
          </Button>
        </div>
      </form>
    </Form>
  );
}
