import React from "react";
import { UseFormReturn } from "react-hook-form";

import { QuestionFormValues } from "../index";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<QuestionFormValues, any, undefined>;
  index: number;
};

export function ShortAnswerOptions({ form, index }: Props) {
  if (form.watch(`questions.${index}.questionType`) === "short_answer") {
    return (
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
                Student response must match this exactly (considering case
                sensitivity setting)
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
    );
  }
}
