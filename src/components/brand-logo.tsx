import Image from "next/image";
import logo from "@/app/icon.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export default function BrandLogo({
  size = 42,
  className,
}: BrandLogoProps) {
  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      aria-hidden
    />
  );
}
