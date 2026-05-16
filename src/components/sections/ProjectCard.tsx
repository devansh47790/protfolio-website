import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import type { Project } from '../../types/content';

interface Props { project: Project }

function sizedImageUrl(url: string, width: number) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&w=${width}&q=75&fit=max`;
}

export default function ProjectCard({ project }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
      className="group border border-surface-400 bg-surface-100 transition-colors hover:border-gold-300/70"
    >
      <Link to={`/projects/${project.slug}`} className="block">
        <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${project.coverColor}`}>
          {project.imageUrl ? (
            <img
              src={sizedImageUrl(project.imageUrl, 720)}
              srcSet={[
                `${sizedImageUrl(project.imageUrl, 480)} 480w`,
                `${sizedImageUrl(project.imageUrl, 720)} 720w`,
                `${sizedImageUrl(project.imageUrl, 960)} 960w`,
              ].join(', ')}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(circle,rgba(28,27,27,0.08)_1px,transparent_1px)] bg-[length:18px_18px] opacity-50"
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-charcoal-900/35" aria-hidden />
          <div className="absolute bottom-6 left-6 right-6 text-surface-50">
            <p className="caption text-surface-50/80">{project.category}</p>
            <p className="mt-2 font-display text-h4 leading-tight">{project.title}</p>
          </div>
        </div>

        <div className="border-t border-surface-400 p-6 md:p-8">
          <p className="text-body-md text-charcoal-500">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <p className="caption mt-8 text-gold-500 group-hover:text-charcoal-900">
            View project -&gt;
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
