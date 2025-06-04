import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  showTime?: boolean;
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  className,
  showTime = true,
}: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleValueChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    onSeek(newTime);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Slider
        value={[progress]}
        onValueChange={handleValueChange}
        max={100}
        step={0.1}
        className="w-full"
        aria-label="Seek audio position"
      />
      {showTime && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      )}
    </div>
  );
}
