
import { useToast as useToastOriginal, toast } from "@radix-ui/react-toast";

export { useToastOriginal as useToast, toast };

// Re-export type for actions
export type ToastActionType = {
  altText: string;
  onClick: () => void;
};
