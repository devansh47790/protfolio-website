import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  eyebrow?: string;
  heading?: string;
  description?: string;
}

const spacings = {
  sm: 'py-16 md:py-24',
  md: 'py-20 md:py-32',
  lg: 'py-24 md:py-section',
};

export default function Section({
  children,
  id,
  className,
  spacing = 'md',
  eyebrow,
  heading,
  description,
}: Props) {
  return (
    <section id={id} className={cn(spacings[spacing], className)}>
      <div className="container-page">
        {(eyebrow || heading || description) && (
          <div className="mb-12 max-w-2xl md:mb-16">
            {eyebrow && <p className="caption text-gold-500">{eyebrow}</p>}
            {heading && <h2 className="mt-4">{heading}</h2>}
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
