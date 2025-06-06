import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  isPlaying: boolean;
  isLoading?: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

export function PlayButton({
  isPlaying,
  isLoading = false,
  onClick,
  size = "md",
  variant = "default",
  className,
}: PlayButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      disabled={isLoading}
      className={cn(sizeClasses[size], className)}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : isPlaying ? (
        <Pause size={iconSizes[size]} />
      ) : (
        <Play size={iconSizes[size]} />
      )}
    </Button>
  );
}
