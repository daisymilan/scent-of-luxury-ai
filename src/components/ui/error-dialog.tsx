
import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description: string
  id?: string
  showHelp?: boolean
  onHelp?: () => void
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  description,
  id,
  showHelp = false,
  onHelp,
}: ErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-zinc-900 text-white border-zinc-800">
        <AlertDialogHeader className="flex flex-row justify-between items-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogCancel className="p-1 h-auto w-auto text-gray-400 hover:text-white hover:bg-transparent">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </AlertDialogCancel>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-gray-300">
          {description}
        </AlertDialogDescription>
        {id && (
          <div className="flex items-center text-xs text-gray-500">
            <span>ID: {id}</span>
            <button 
              className="ml-2 p-0.5 hover:text-gray-300" 
              onClick={() => {
                navigator.clipboard.writeText(id);
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c0-1.1.9-2 2-2h2" />
                <path d="M4 12c0-1.1.9-2 2-2h2" />
                <path d="M4 8c0-1.1.9-2 2-2h2" />
              </svg>
            </button>
          </div>
        )}
        <AlertDialogFooter>
          {showHelp && (
            <AlertDialogAction 
              className="bg-zinc-700 hover:bg-zinc-600 text-white" 
              onClick={onHelp}
            >
              Get help
            </AlertDialogAction>
          )}
          <AlertDialogAction 
            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
            onClick={() => onOpenChange(false)}
          >
            Dismiss
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
