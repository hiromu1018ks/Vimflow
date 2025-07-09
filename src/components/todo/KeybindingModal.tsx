import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { HelpCircle } from "lucide-react";
import { KeybindingHelp } from "@/components/todo/KeybindingHelp";

interface KeybindingModalProps {
  children?: React.ReactNode;
}

export const KeybindingModal: React.FC<KeybindingModalProps> = ({
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <button className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <KeybindingHelp />
      </DialogContent>
    </Dialog>
  );
};
