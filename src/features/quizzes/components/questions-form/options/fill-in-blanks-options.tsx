import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

import { QuestionFormValues } from "../index";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addBlank, removeOption } from "../utils";

type Props = {
  form: UseFormReturn<QuestionFormValues, any, undefined>;
  index: number;
  updateMode?: boolean;
};

// Define the blank type to use in type guards
interface FillInBlank {
  id: string;
  correctAnswer: string;
  caseSensitive?: boolean;
}

export function FillInBlanksOptions({ form, index, updateMode }: Props) {
  const questionType = form.watch(`questions.${index}.questionType`);

  if (questionType !== "fill_in_blank") {
    return null;
  }

  // Since we know question type is fill_in_blank, get the options with proper typing
  const options = form.watch(`questions.${index}.options`) as FillInBlank[];

  // Helper function to safely get the correctAnswer object
  const getCorrectAnswerObject = (): Record<string, string> => {
    const correctAnswer = form.watch(`questions.${index}.correctAnswer`);

    // Ensure it's an object
    if (
      typeof correctAnswer === "object" &&
      correctAnswer !== null &&
      !Array.isArray(correctAnswer)
    ) {
      return correctAnswer as Record<string, string>;
    }

    // If it's not an object (could be boolean or array), return empty object
    return {};
  };

  return (
    <>
      <div className="space-y-4 mb-4">
        {(form.watch(`questions.${index}.options`) || []).map(
          (blank, blankIndex) => (
            <div key={blank.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <FormLabel className="w-24">Blank {blankIndex + 1}</FormLabel>
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

                    // Update correctAnswer mapping safely
                    const currentCorrectAnswer = getCorrectAnswerObject();
                    form.setValue(`questions.${index}.correctAnswer`, {
                      ...currentCorrectAnswer,
                      [blank.id]: e.target.value,
                    });
                  }}
                  className="flex-1"
                />
                {!updateMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index, blankIndex, form)}
                    disabled={
                      (form.watch(`questions.${index}.options`) || []).length <=
                      1
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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
          )
        )}
      </div>
      <FormDescription className="mb-4">
        Use {"{}"} in your question text to indicate where blanks should appear.
      </FormDescription>
      {!updateMode && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlank(index, form)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blank
        </Button>
      )}
    </>
  );
}
