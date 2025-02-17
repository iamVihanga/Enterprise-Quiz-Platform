"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { banUserSchema, type BanUserSchema } from "../schemas/ban-user";
import { useBanUser } from "../api";
import { UserMinus } from "lucide-react";

type Props = {
  userId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function BanUserDialog({ userId, open, setOpen }: Props) {
  const { mutate, isPending } = useBanUser();

  const form = useForm<BanUserSchema>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId: userId,
      banReason: "",
      banExpiresIn: 0,
    },
  });

  const onSubmit = (values: BanUserSchema) => {
    mutate(
      {
        ...values,
        banExpiresIn: (values?.banExpiresIn ?? 0) * 60 * 60 * 24,
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure ?</DialogTitle>
          <DialogDescription>
            You are about to ban the selected user. You can always unban them
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-4"
          >
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ban Reason</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Leave ban reason here..." />
                  </FormControl>

                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banExpiresIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Ban Expires (in days)`}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ban duration in days"
                      min={0}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>

                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                loading={isPending}
                icon={<UserMinus className="size-4" />}
              >
                Ban User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
