"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { EditIcon, Trash2, XIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SelectQuestion } from "@/db/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  type UpdateQuestionInput,
  updateQuestionSchema,
} from "@/features/quizzes/schemas/zod-quiz-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MediaUploader } from "@/modules/media/components/MediaUploader";
import { MediaUploadPaths } from "@/modules/media/types";
import { Button } from "@/components/ui/button";

import { MultipleChoiceOptions } from "./options/multiple-choice-options";
import { TrueFalseOptions } from "./options/true-false-options";
import { ShortAnswerOptions } from "./options/short-answer-options";
import { MatchingOptions } from "./options/matching-options";
import { FillInBlanksOptions } from "./options/fill-in-blanks-options";
import { Switch } from "@/components/ui/switch";

import { useDeleteQuestion } from "../../api/use-delete-question";
import { useUpdateQuestion } from "../../api/use-update-question";

type Props = {
  quidId: number;
  questions: SelectQuestion[];
};

export type UpdateQuestionsFormValues = {
  questions: UpdateQuestionInput[];
};

export function QuestionsUpdateForm({ questions, quidId }: Props) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const { mutate: mutateDeletion, isPending: isDeleting } = useDeleteQuestion();
  const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateQuestion();

  const form = useForm<UpdateQuestionsFormValues>({
    resolver: zodResolver(
      z.object({
        questions: z.array(updateQuestionSchema),
      })
    ),
    defaultValues: {
      questions: questions as any,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleDeleteQuestion = (id: string, index: number) => {
    const originalId = questions[index].id;

    // Perform question deletion
    mutateDeletion(
      { id: originalId.toString() },
      {
        onSuccess: () => remove(index),
      }
    );
  };

  const handleUpdateQuestion = (id: string, index: number) => {
    const originalId = questions[index].id;
    const updatedFields = form.getValues().questions[index];

    mutateUpdate({
      values: updatedFields,
    });
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={() => {}} className="space-y-6">
          <Accordion
            type="multiple"
            value={expandedQuestions}
            onValueChange={(values) => {
              setExpandedQuestions([values[values.length - 1]]);
            }}
            className="w-full space-y-4"
          >
            {fields.map((field, index) => {
              return (
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
                            ? form.watch(`questions.${index}.questionText`)
                                .length > 40
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
                              <Input
                                type="text"
                                {...field}
                                disabled
                                value={field.value.replace("_", " ")}
                                className="capitalize"
                              />
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
                                {field.value ? (
                                  <div className="w-72 h-52 relative rounded-md overflow-hidden">
                                    <Image
                                      src={field.value}
                                      alt="media"
                                      width={300}
                                      height={200}
                                      className="object-cover rounded-md"
                                    />
                                    <Button
                                      size={"icon"}
                                      variant={"destructive"}
                                      className="absolute top-2 right-2"
                                      onClick={() => field.onChange("")}
                                    >
                                      <XIcon className="size-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <MediaUploader
                                    acceptedTypes={["image", "video"]}
                                    onUpload={(result) => {
                                      field.onChange(result.url);
                                    }}
                                    onError={(error) => {
                                      console.log(error.message);
                                    }}
                                    path={
                                      MediaUploadPaths.QUIZZES + `/${quidId}`
                                    }
                                  />
                                )}
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
                          {field.questionType === "multiple_choice" && (
                            <MultipleChoiceOptions
                              form={form as any}
                              index={index}
                              updateMode
                            />
                          )}

                          {/* True/False Options */}
                          {field.questionType === "true_false" && (
                            <TrueFalseOptions
                              form={form as any}
                              index={index}
                              updateMode
                            />
                          )}

                          {/* Short Answer Options */}
                          {field.questionType === "short_answer" && (
                            <ShortAnswerOptions
                              form={form as any}
                              index={index}
                              updateMode
                            />
                          )}

                          {/* Matching Options */}
                          {field.questionType === "matching" && (
                            <MatchingOptions
                              form={form as any}
                              index={index}
                              updateMode
                            />
                          )}

                          {/* Fill in the Blank Options */}
                          {field.questionType === "fill_in_blank" && (
                            <FillInBlanksOptions
                              form={form as any}
                              index={index}
                              updateMode
                            />
                          )}
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
                            onClick={() =>
                              handleDeleteQuestion(field.id, index)
                            }
                            icon={<Trash2 />}
                            loading={isDeleting}
                          >
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

                        <Button
                          type="button"
                          icon={<EditIcon />}
                          onClick={() => handleUpdateQuestion(field.id, index)}
                          loading={isUpdating}
                        >
                          Update Question
                        </Button>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              );
            })}
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
