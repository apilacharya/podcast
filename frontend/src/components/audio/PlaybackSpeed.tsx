import { PLAYBACK_RATES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlaybackSpeedProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

export function PlaybackSpeed({
  playbackRate,
  onPlaybackRateChange,
}: PlaybackSpeedProps) {
  return (
    <Select
      value={playbackRate.toString()}
      onValueChange={(value) => onPlaybackRateChange(parseFloat(value))}
    >
      <SelectTrigger className="w-16 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PLAYBACK_RATES.map((rate) => (
          <SelectItem key={rate} value={rate.toString()}>
            {rate}x
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
