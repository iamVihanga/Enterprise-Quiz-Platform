"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  UserCheck2Icon,
  UserMinus,
  UserPenIcon,
  UserRoundX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "./columns";

import { UpdateUserSheet } from "../update-user-sheet";
import { BanUserDialog } from "../ban-user-dialog";
import { UnbanUserAlert } from "../unban-user-alert";
import { RemoveUserAlert } from "../delete-user-alert";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [isUnbanModalOpen, setUnbanModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  return (
    <>
      {/* Update Sheet */}
      <UpdateUserSheet
        open={isUpdateOpen}
        setOpen={setUpdateOpen}
        updateUserId={data.id}
      />

      {/* Ban User Alert */}
      <BanUserDialog
        open={isBanModalOpen}
        setOpen={setBanModalOpen}
        userId={data.id}
      />

      {/* Unban user alert */}
      <UnbanUserAlert
        open={isUnbanModalOpen}
        setOpen={setUnbanModalOpen}
        userId={data.id}
      />

      <RemoveUserAlert
        open={isRemoveModalOpen}
        setOpen={setRemoveModalOpen}
        userId={data.id}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Update Sheet */}
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <UserPenIcon className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>

          {data.banned ? (
            <DropdownMenuItem onClick={() => setUnbanModalOpen(true)}>
              <UserCheck2Icon className="mr-2 h-4 w-4" /> Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setBanModalOpen(true)}>
              <UserMinus className="mr-2 h-4 w-4" /> Ban User
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setRemoveModalOpen(true)}>
            <UserRoundX className="mr-2 h-4 w-4" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
