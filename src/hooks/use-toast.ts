
// This file now properly re-exports the toast components from shadcn/ui toast
import { Toast, type ToastActionElement, type ToastProps } from "@/components/ui/toast";
import { useToast, toast } from "@/components/ui/use-toast";

// Re-export the hook and toast function
export { useToast, toast };

// Re-export the Toast component types with proper type syntax
export { Toast };
export type { ToastActionElement, ToastProps };

// Re-export toast action type
export type ToastAction = {
  altText: string;
  onClick: () => void;
};

