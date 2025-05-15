
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileImageProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ 
  src, 
  name = "", 
  size = "md", 
  className = "" 
}) => {
  // Get initials from name
  const getInitials = () => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine size classes based on prop
  const getSizeClass = () => {
    switch(size) {
      case "sm": return "h-8 w-8";
      case "md": return "h-10 w-10";
      case "lg": return "h-16 w-16";
      case "xl": return "h-24 w-24";
      default: return "h-10 w-10";
    }
  };

  return (
    <Avatar className={`${getSizeClass()} ${className}`}>
      {src ? (
        <AvatarImage src={src} alt={name || "User"} />
      ) : null}
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials() || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
};
