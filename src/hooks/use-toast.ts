
// This file now properly re-exports the toast components from shadcn/ui toast
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

import {
  useToast as useToastPrimitive,
  type ToastActionType,
} from "@/components/ui/use-toast";

// Re-export hook with correct type
export const useToast = useToastPrimitive;

// Re-export toast action type
export type ToastAction = ToastActionType;

// Re-export the Toast component types
export { Toast, ToastActionElement, ToastProps };
