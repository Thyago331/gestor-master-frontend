interface BrandMarkProps {
  size?: "default" | "compact";
}

export function BrandMark({ size = "default" }: BrandMarkProps) {
  return (
    <span className={`brand-mark brand-mark-${size}`} aria-hidden="true">
      <img src="/brand/logo-transparent.png" alt="" />
    </span>
  );
}
