import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * The quiet "Read the case study" link the homepage uses under a build, for
 * any page on this site. `label` names the destination for screen readers
 * when the visible text alone would be vague.
 */
export const CaseLink = ({
  to,
  children = "Read the case study",
  label,
  className = "",
}: {
  to: string;
  children?: string;
  label?: string;
  className?: string;
}) => (
  <Link
    to={to}
    aria-label={label}
    className={`group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground ${className}`}
  >
    {children}
    <ArrowRight
      aria-hidden
      className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
    />
  </Link>
);
