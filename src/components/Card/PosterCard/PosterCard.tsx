import { cn } from "@/utilities/cn";

type Props = {
  className?: string;
  title: string;
  children?: React.ReactNode;
  testId?: string;
  imageSrc?: string | null;
  imageAlt?: string;
};

export const PosterCard = ({
  title,
  children,
  className,
  testId,
  imageSrc,
  imageAlt,
}: Props) => {
  const fallback = `https://placehold.co/384x220?text=${encodeURIComponent(
    title
  )}`;

  return (
    <div
      className={cn(
        "card bg-base-100 w-full shadow-sm overflow-hidden",
        className
      )}
      data-testid={testId}
    >
      <figure className="w-full">
        <img
          src={imageSrc ?? fallback}
          alt={imageAlt ?? title}
          className="w-full h-56 sm:h-64 lg:h-72 object-cover"
          loading="lazy"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};
