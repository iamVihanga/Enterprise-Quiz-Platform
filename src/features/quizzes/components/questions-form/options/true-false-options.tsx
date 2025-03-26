import React from "react";
import { UseFormReturn } from "react-hook-form";

import { QuestionFormValues } from "../index";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  form: UseFormReturn<QuestionFormValues, any, undefined>;
  index: number;
  updateMode?: boolean;
};

export function TrueFalseOptions({ form, index, updateMode = false }: Props) {
  if (form.watch(`questions.${index}.questionType`) === "true_false") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.watch(`questions.${index}.correctAnswer`) === true}
            onCheckedChange={() => {
              form.setValue(`questions.${index}.correctAnswer`, true);
            }}
          />
          <span>True</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.watch(`questions.${index}.correctAnswer`) === false}
            onCheckedChange={() => {
              form.setValue(`questions.${index}.correctAnswer`, false);
            }}
          />
          <span>False</span>
        </div>
      </div>
    );
  }
}
