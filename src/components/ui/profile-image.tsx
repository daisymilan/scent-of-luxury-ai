
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileImageProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ProfileImage({ src, name, size = "md", className }: ProfileImageProps) {
  const getSize = () => {
    switch (size) {
      case "sm": return "h-8 w-8";
      case "md": return "h-12 w-12";
      case "lg": return "h-16 w-16";
      case "xl": return "h-24 w-24";
      default: return "h-12 w-12";
    }
  };
  
  const getInitials = () => {
    if (!name) return "?";
    return name
      .split(' ')
      .filter(part => part.length > 0)
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Avatar className={`${getSize()} ${className}`}>
      <AvatarImage src={src || ""} />
      <AvatarFallback className="bg-primary text-white font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
