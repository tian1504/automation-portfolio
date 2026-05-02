import { motion } from "motion/react";

type SectionHeadingProps = {
  number: string;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({
  number,
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) => {
  const alignClass = align === "center" ? "mx-auto text-center items-center" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 max-w-3xl flex flex-col ${alignClass}`}
    >
      <div className="font-mono text-[11px] md:text-xs text-primary tracking-[0.2em] mb-5 flex items-center gap-3 uppercase">
        <span>{number}</span>
        <span className="h-px w-8 bg-primary/40" aria-hidden />
        <span>{label}</span>
      </div>

      <h2 className="font-display font-bold tracking-tighter-2 text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1]">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};
