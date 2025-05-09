
interface WebhookErrorProps {
  isWebhookFailed: boolean;
}

export const WebhookError = ({ isWebhookFailed }: WebhookErrorProps) => {
  if (!isWebhookFailed) return null;
  
  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
      Could not connect to our servers. Using alternative response method.
    </div>
  );
};
