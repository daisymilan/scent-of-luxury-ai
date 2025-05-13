
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8 bg-primary/10">
      <AvatarFallback className="bg-primary/10 text-primary">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};
