import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  eyebrow?: string;
  heading?: string;
  headingLevel?: 'h1' | 'h2';
  description?: string;
}

const spacings = {
  sm: 'py-12 md:py-16 lg:py-20',
  md: 'py-14 md:py-20 lg:py-24',
  lg: 'py-16 md:py-24 lg:py-28',
};

export default function Section({
  children,
  id,
  className,
  spacing = 'md',
  eyebrow,
  heading,
  headingLevel = 'h2',
  description,
}: Props) {
  const Heading = headingLevel;

  return (
    <section id={id} className={cn('site-section', spacings[spacing], className)}>
      <div className="container-page">
        {(eyebrow || heading || description) && (
          <div className="mb-10 max-w-2xl md:mb-12">
            {eyebrow && <p className="caption text-gold-500">{eyebrow}</p>}
            {heading && <Heading className="mt-4">{heading}</Heading>}
            {description && (
              <p className="mt-4 text-body-lg text-charcoal-500">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
