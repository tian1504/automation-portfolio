/**
 * A section heading with the same look as SectionHeading, but always visible:
 * no fade-in, so its words are on the page for every reader, including
 * crawlers that never scroll. Used by the service pages and newer case studies.
 */
export const PlainHeading = ({ title, description, id }: { title: string; description?: string; id?: string }) => (
  <div className="mb-12 flex max-w-3xl flex-col md:mb-16">
    <h2
      id={id}
      className="font-display text-3xl font-bold leading-[1] tracking-tighter-2 text-foreground md:text-4xl lg:text-5xl"
    >
      {title}
    </h2>
    {description && (
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
    )}
  </div>
);
