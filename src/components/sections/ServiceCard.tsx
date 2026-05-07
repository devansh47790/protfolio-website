import Card from '../ui/Card';
import type { Service } from '../../types/content';

interface Props { service: Service }

const ICONS: Record<string, React.ReactNode> = {
  code: (
    <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M14 7l-4 10" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5M3 17l9 5 9-5" strokeWidth={1.2} strokeLinejoin="round" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth={1.2} />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" strokeWidth={1.2} />
    </>
  ),
  gauge: (
    <>
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={1.2} />
      <path d="M12 12l4-3" strokeWidth={1.2} strokeLinecap="round" />
    </>
  ),
};

export default function ServiceCard({ service }: Props) {
  return (
    <Card hoverable>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-charcoal-900">
        {ICONS[service.icon] ?? null}
      </svg>
      <h3 className="mt-8 text-h4">{service.title}</h3>
      <p className="mt-3 text-body-md text-charcoal-500">{service.summary}</p>
      <ul className="mt-6 space-y-3 text-body-md text-charcoal-700">
        {service.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-3 h-px w-3 shrink-0 bg-gold-300" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
