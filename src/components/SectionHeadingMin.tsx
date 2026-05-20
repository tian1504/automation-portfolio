import { motion } from "motion/react";

type Props = {
  title: string;
  description?: string;
};

/**
 * Minimal paco.me-style section heading.
 * Small h2 label, optional one-line italic description.
 * No numbering, no big editorial period, no chip.
 * The whole point is that the heading recedes and the content speaks.
 */
export const SectionHeadingMin = ({ title, description }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className="mb-10 max-w-2xl"
    >
      <h2 className="text-base md:text-[17px] font-semibold text-foreground/95 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed italic">
          {description}
        </p>
      )}
    </motion.div>
  );
};
