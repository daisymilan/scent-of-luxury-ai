
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
import { X, ExternalLink, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description: string
  id?: string
  showHelp?: boolean
  onHelp?: () => void
  errorType?: 'api' | 'general'  // Added error type prop
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  description,
  id,
  showHelp = false,
  onHelp,
  errorType = 'general',  // Default to general error
}: ErrorDialogProps) {
  const { toast } = useToast()

  // Determine if this is a WooCommerce API error
  const isWooCommerceError = description.includes("store data") || 
                            description.includes("WooCommerce") ||
                            errorType === 'api'

  const copyId = () => {
    if (id) {
      navigator.clipboard.writeText(id)
      toast({
        title: "Copied to clipboard",
        description: "Error ID copied to clipboard"
      })
    }
  }

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
        
        {/* Add WooCommerce specific help content */}
        {isWooCommerceError && (
          <div className="mt-4 text-sm bg-zinc-800 p-3 rounded-md">
            <p className="font-medium text-gray-200 mb-2">Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Check your internet connection</li>
              <li>Verify WooCommerce API credentials in settings</li>
              <li>Ensure your WooCommerce store is online</li>
              <li>Check if CORS is enabled on your store</li>
            </ul>
          </div>
        )}

        {id && (
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <span>ID: {id}</span>
            <button 
              className="ml-2 p-0.5 hover:text-gray-300" 
              onClick={copyId}
              aria-label="Copy error ID"
            >
              <Copy size={12} />
            </button>
          </div>
        )}
        <AlertDialogFooter className="gap-2">
          {showHelp && (
            <AlertDialogAction 
              className="bg-zinc-700 hover:bg-zinc-600 text-white" 
              onClick={onHelp}
            >
              Get help
            </AlertDialogAction>
          )}
          {isWooCommerceError && (
            <AlertDialogAction 
              className="bg-zinc-700 hover:bg-zinc-600 text-white flex items-center gap-1" 
              asChild
            >
              <a 
                href="https://woocommerce.com/document/woocommerce-rest-api/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                WooCommerce API Docs <ExternalLink size={14} />
              </a>
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
