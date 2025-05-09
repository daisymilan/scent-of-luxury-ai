
interface AssistantFooterProps {
  user?: { role?: string };
}

export const AssistantFooter = ({ user }: AssistantFooterProps) => {
  return (
    <div className="mb-2 text-center text-sm text-gray-600">
      <p>Try asking about: sales, KPIs, inventory, orders, or marketing campaigns</p>
      {user?.role === 'CEO' && <p className="mt-1 text-xs opacity-75">Premium insights available for CEO role</p>}
    </div>
  );
};
