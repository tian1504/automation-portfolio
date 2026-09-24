import { motion } from "motion/react";

type SectionHeadingProps = {
  /** Kept so existing call sites compile. No longer rendered. */
  number?: string;
  /** Kept so existing call sites compile. No longer rendered. */
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({ title, description, align = "left" }: SectionHeadingProps) => {
  const alignClass = align === "center" ? "mx-auto text-center items-center" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 max-w-3xl flex flex-col ${alignClass}`}
    >
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
