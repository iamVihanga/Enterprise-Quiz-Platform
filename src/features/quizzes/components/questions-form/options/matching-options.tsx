import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

import { QuestionFormValues } from "../index";

import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addMatchingPair, removeOption } from "../utils";

type Props = {
  form: UseFormReturn<QuestionFormValues, any, undefined>;
  index: number;
  updateMode?: boolean;
};

// Define the matching pair type to use in type guards
interface MatchingPair {
  id: string;
  prompt: string;
  match: string;
}

export function MatchingOptions({ form, index, updateMode = false }: Props) {
  const questionType = form.watch(`questions.${index}.questionType`);

  if (questionType !== "matching") {
    return null;
  }

  // Since we know question type is matching, get the options with proper typing
  const options = form.watch(`questions.${index}.options`) as MatchingPair[];

  // Helper function to check if an option is a matching pair
  const isMatchingPair = (option: any): option is MatchingPair => {
    return option && "prompt" in option && "match" in option;
  };

  return (
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
        {(options || []).map((pair, pairIndex) => {
          // Type guard to ensure we're dealing with a matching pair
          if (!isMatchingPair(pair)) return null;

          return (
            <div key={pair.id} className="grid grid-cols-2 gap-2 items-center">
              <Input
                placeholder={`Item ${pairIndex + 1}`}
                value={pair.prompt || ""}
                onChange={(e) => {
                  form.setValue(
                    `questions.${index}.options.${pairIndex}.prompt`,
                    e.target.value
                  );

                  // Update correctAnswer mapping
                  const currentCorrectAnswer = form.watch(
                    `questions.${index}.correctAnswer`
                  ) as Record<string, string>;

                  form.setValue(`questions.${index}.correctAnswer`, {
                    ...currentCorrectAnswer,
                    [pair.id]: pair.match || "",
                  });
                }}
              />
              <div className="flex gap-2">
                <Input
                  placeholder={`Match ${pairIndex + 1}`}
                  value={pair.match || ""}
                  onChange={(e) => {
                    form.setValue(
                      `questions.${index}.options.${pairIndex}.match`,
                      e.target.value
                    );

                    // Update correctAnswer mapping
                    const currentCorrectAnswer = form.watch(
                      `questions.${index}.correctAnswer`
                    ) as Record<string, string>;
                    form.setValue(`questions.${index}.correctAnswer`, {
                      ...currentCorrectAnswer,
                      [pair.id]: e.target.value,
                    });
                  }}
                  className="flex-1"
                />
                {!updateMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index, pairIndex, form)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!updateMode && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addMatchingPair(index, form)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pair
        </Button>
      )}
    </>
  );
}
