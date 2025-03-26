import React from "react";
import { UseFormReturn } from "react-hook-form";

import { QuestionFormValues } from "../index";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2 } from "lucide-react";

import { addMultipleChoiceOption, removeOption } from "../utils";

type Props = {
  form: UseFormReturn<QuestionFormValues, any, undefined>;
  index: number;
  updateMode?: boolean;
};

export function MultipleChoiceOptions({
  form,
  index,
  updateMode = false,
}: Props) {
  if (form.watch(`questions.${index}.questionType`) === "multiple_choice") {
    const correctAnswer = form.watch(
      `questions.${index}.correctAnswer`
    ) as string[];
    const options = form.watch(`questions.${index}.options`) || [];

    return (
      <>
        <div className="space-y-3 mb-4">
          {(form.watch(`questions.${index}.options`) || []).map(
            (option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  checked={
                    Array.isArray(correctAnswer) &&
                    correctAnswer.includes(option.id)
                  }
                  onCheckedChange={(checked) => {
                    // Create a new array to avoid mutation
                    const updatedAnswers = [...correctAnswer];

                    if (checked) {
                      // Add the option ID if checked
                      if (!updatedAnswers.includes(option.id)) {
                        updatedAnswers.push(option.id);
                      }
                    } else {
                      // Remove the option ID if unchecked
                      const index = updatedAnswers.indexOf(option.id);
                      if (index !== -1) {
                        updatedAnswers.splice(index, 1);
                      }
                    }

                    form.setValue(
                      `questions.${index}.correctAnswer`,
                      updatedAnswers
                    );
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
                {!updateMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index, optionIndex, form)}
                    disabled={
                      (form.watch(`questions.${index}.options`) || []).length <=
                      2
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          )}
        </div>
        {!updateMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addMultipleChoiceOption(form, index)}
            icon={<PlusIcon />}
          >
            Add Option
          </Button>
        )}
      </>
    );
  }
}
