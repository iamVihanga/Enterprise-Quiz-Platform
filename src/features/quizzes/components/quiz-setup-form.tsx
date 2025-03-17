"use client";

import { useEffect } from "react";
import { CheckCircle2Icon, RefreshCcwDotIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import {
  addQuizSchema,
  type AddQuizInput,
} from "@/features/quizzes/schemas/zod-quiz-schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MediaUploader } from "@/modules/media/components/MediaUploader";
import { MediaUploadPaths } from "@/modules/media/types";
import { LessonSelector } from "@/features/lessons/components/lesson-selector";
import { useLessonsGridFilters } from "@/features/lessons/components/lessons-grid/use-lessons-grid-filters";
import { Separator } from "@/components/ui/separator";

import { useCreateQuiz } from "../api/use-create-quiz";
import { SelectQuiz } from "../schemas/db-schema";

interface QuizSetupFormProps {
  onSubmit: (data: SelectQuiz) => void;
}

export function QuizSetupForm({ onSubmit }: QuizSetupFormProps) {
  const { lessonId } = useLessonsGridFilters();
  const { mutate, isPending } = useCreateQuiz();

  const form = useForm<AddQuizInput>({
    resolver: zodResolver(addQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      timeLimit: undefined,
      passingScore: 70,
      isPublished: false,
      shuffleQuestions: false,
      showCorrectAnswers: true,
      allowRetakes: true,
      maxAttempts: undefined,
      lessonId: parseInt(lessonId),
    },
  });

  // Listen to lessonId changes
  useEffect(() => {
    form.setValue("lessonId", parseInt(lessonId));
  }, [lessonId]);

  const handleResetForm = () => {
    form.reset();
  };

  const handleSubmit = (values: AddQuizInput) => {
    mutate(values, {
      onSuccess: (data) => {
        onSubmit({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Quiz</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter quiz title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter quiz description"
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of what this quiz is about.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div>
                        <MediaUploader
                          acceptedTypes={["image"]}
                          onUpload={(result) => {
                            field.onChange(result.url);
                          }}
                          onError={(error) => {
                            console.log(error.message);
                          }}
                          path={MediaUploadPaths.QUIZZES}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload image that represents this quiz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="my-12 relative w-full">
              <Separator className="w-full" />

              <div className="absolute w-full -top-2 flex items-center justify-center">
                <p className="w-fit bg-background px-2 text-xs text-foreground/60">
                  Quiz Details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Lesson</FormLabel>

                    <LessonSelector fullWidth widthGrow />

                    <FormDescription>
                      Attach this quiz to a specific lesson (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty for no time limit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Score (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum percentage to pass the quiz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Attempts</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty for unlimited attempts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shuffleQuestions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Shuffle Questions
                          </FormLabel>
                          <FormDescription>
                            Randomize the order of questions for each attempt.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showCorrectAnswers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Show Correct Answers
                          </FormLabel>
                          <FormDescription>
                            Display correct answers after submission.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowRetakes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Retakes
                          </FormLabel>
                          <FormDescription>
                            Let users take the quiz multiple times.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Publish Quiz
                          </FormLabel>
                          <FormDescription>
                            Make this quiz available to users.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="gap-2">
            <Button
              type="submit"
              icon={<CheckCircle2Icon />}
              loading={isPending}
            >
              Complete Setup
            </Button>
            <Button
              type="button"
              icon={<RefreshCcwDotIcon />}
              variant={"secondary"}
              onClick={handleResetForm}
            >
              Reset Form
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
