import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZE_MAP = {
  xs:  "w-7 h-7",
  sm:  "w-9 h-9",
  md:  "w-11 h-11",
  lg:  "w-20 h-20",
  xl:  "w-24 h-24",
} as const;

type AvatarSize = keyof typeof SIZE_MAP;

interface AvatarProps {
  src:        string | null;
  alt:        string;
  size?:      AvatarSize;
  className?: string;
  priority?:  boolean;
}

export function Avatar({
  src, alt, size = "md", className, priority = false,
}: AvatarProps) {
  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-zinc-100 flex-shrink-0",
      SIZE_MAP[size],
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            size === "lg" || size === "xl" ? "80px"
            : size === "md" ? "44px"
            : "36px"
          }
          className="object-cover"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#9355A6] to-[#C084D8]" />
      )}
    </div>
  );
}
