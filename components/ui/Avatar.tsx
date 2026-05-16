import Image from "next/image";

interface AvatarProps {
  src:        string | null;
  alt:        string;
  size?:      number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className = "" }: AvatarProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden bg-[#F0F0F0] flex-shrink-0 ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#9355A6] to-[#C084D8]" />
      )}
    </div>
  );
}
