
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function BotAvatar() {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="/lovable-uploads/e6e84936-32d0-4228-be3a-6432509ca2b9.png" alt="AI" />
      <AvatarFallback className="bg-primary/10">AI</AvatarFallback>
    </Avatar>
  );
}
