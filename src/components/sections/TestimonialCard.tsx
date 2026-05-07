import Card from '../ui/Card';
import type { Testimonial } from '../../types/content';

interface Props { testimonial: Testimonial }

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <Card>
      <p className="font-display text-h4 leading-snug text-charcoal-900">
        "{testimonial.quote}"
      </p>
      <div className="mt-8 border-t border-surface-400 pt-6">
        <p className="caption text-charcoal-900">{testimonial.author}</p>
        <p className="mt-2 text-body-md text-charcoal-500">
          {testimonial.role} / {testimonial.company}
        </p>
      </div>
    </Card>
  );
}
