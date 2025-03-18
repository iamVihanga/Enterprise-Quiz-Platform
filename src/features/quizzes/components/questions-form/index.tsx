"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ImportIcon,
  SaveIcon,
  Undo,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

import { questionTypes, type SelectQuiz } from "@/db/schema";

import {
  addQuestionSchema,
  type AddQuestionInput,
} from "@/features/quizzes/schemas/zod-quiz-schema";

import { MediaUploader } from "@/modules/media/components/MediaUploader";
import { MediaUploadPaths } from "@/modules/media/types";

// Utils
import {
  addQuestion,
  handleQuestionTypeChange,
  moveQuestionDown,
  moveQuestionUp,
} from "./utils";
import { MultipleChoiceOptions } from "./options/multiple-choice-options";
import { TrueFalseOptions } from "./options/true-false-options";
import { ShortAnswerOptions } from "./options/short-answer-options";
import { MatchingOptions } from "./options/matching-options";
import { FillInBlanksOptions } from "./options/fill-in-blanks-options";

import { useCreateQuestions } from "@/features/quizzes/api/use-create-questions";
import { useRouter } from "next/navigation";

// Type for our form values
export type QuestionFormValues = {
  questions: AddQuestionInput[];
};

interface QuizQuestionFormProps {
  quizData: SelectQuiz;
}

export function QuestionsForm({ quizData }: QuizQuestionFormProps) {
  const router = useRouter();
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const { mutate, isPending } = useCreateQuestions();

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

  const onSubmit = (data: QuestionFormValues) => {
    mutate(
      {
        questions: data.questions,
        quizId: quizData.id.toString(),
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/quizzes/${quizData.id}`);
        },
      }
    );
  };

  const handleAddQuestion = () => {
    addQuestion(append, fields, expandedQuestions, setExpandedQuestions);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Questions List Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-3">
            <Button icon={<ImportIcon />} type="button" variant="outline">
              Import Questions
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" icon={<Undo />}>
                  Undo Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove
                    all questions from your quiz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction type="button" onClick={() => form.reset()}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddQuestion}
              icon={<Plus />}
            >
              Add Question
            </Button>

            <Button icon={<SaveIcon />} loading={isPending}>
              Save Quiz
            </Button>
          </div>
        </div>

        {/* Questions List as Accordians */}
        <Accordion
          type="multiple"
          value={expandedQuestions}
          onValueChange={(values) => {
            setExpandedQuestions([values[values.length - 1]]);
          }}
          className="w-full space-y-4"
        >
          {fields.map((field, index) => (
            <Card key={field.id} className="border">
              <AccordionItem
                value={`question-${index}`}
                className={`border-none overflow-hidden hover:shadow-md ${
                  expandedQuestions.includes(`question-${index}`)
                    ? "shadow-md"
                    : ""
                }`}
              >
                <AccordionTrigger
                  className={`px-6 py-4 hover:no-underline ${
                    expandedQuestions.includes(`question-${index}`)
                      ? "bg-secondary/80 dark:bg-secondary/60"
                      : ""
                  }`}
                >
                  <div
                    className={`flex justify-between items-center w-full h-full`}
                  >
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

                <AccordionContent
                  className={`px-6 py-4 ${
                    expandedQuestions.includes(`question-${index}`)
                      ? "bg-secondary/40 dark:bg-secondary/20"
                      : ""
                  }`}
                >
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
                              handleQuestionTypeChange(form, index, value);
                              field.onChange(value);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {questionTypes.map((type) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="capitalize"
                                >
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
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questions.${index}.mediaUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attach Media</FormLabel>
                          <FormControl>
                            <MediaUploader
                              acceptedTypes={["image", "video"]}
                              onUpload={(result) => {
                                field.onChange(result.url);
                              }}
                              onError={(error) => {
                                console.log(error.message);
                              }}
                              path={
                                MediaUploadPaths.QUIZZES + `/${quizData.id}`
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questions.${index}.explanation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{`Explanation (Optional)`}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide an explanation for the correct answer"
                              className="min-h-44"
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

                    <div className="md:col-span-2 border p-4 rounded-md">
                      <h4 className="font-medium mb-4">Answer Options</h4>

                      {/* Multiple Choice Options */}
                      <MultipleChoiceOptions form={form} index={index} />

                      {/* True/False Options */}
                      <TrueFalseOptions form={form} index={index} />

                      {/* Short Answer Options */}
                      <ShortAnswerOptions form={form} index={index} />

                      {/* Matching Options */}
                      <MatchingOptions form={form} index={index} />

                      {/* Fill in the Blank Options */}
                      <FillInBlanksOptions form={form} index={index} />
                    </div>
                  </div>

                  {/* Accordion Footer */}
                  <Card
                    className={`p-3 mt-12 flex items-center justify-between gap-3 w-full border-none ${
                      expandedQuestions.includes(`question-${index}`)
                        ? "bg-secondary/80 dark:bg-secondary/40"
                        : ""
                    }`}
                  >
                    <div className="flex gap-5">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Question
                      </Button>

                      <FormField
                        control={form.control}
                        name={`questions.${index}.isRequired`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm !mt-0">
                              Mark as Required
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestionUp(index, move)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Move Up
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestionDown(index, move, fields)}
                        disabled={index === fields.length - 1}
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Move Down
                      </Button>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      </form>
    </Form>
  );
}
