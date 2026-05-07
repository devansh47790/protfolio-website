import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Badge from '../components/ui/Badge';
import Seo from '../components/seo/Seo';
import { getBlogPostBySlug } from '../lib/cms';
import type { BlogPost } from '../types/content';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    getBlogPostBySlug(slug).then(setPost);
  }, [slug]);

  if (post === undefined) {
    return <div className="container-page py-20 text-charcoal-500">Loading...</div>;
  }

  if (post === null) {
    return (
      <PageTransition>
        <Section spacing="lg">
          <h1>Post not found</h1>
          <p className="mt-3 text-charcoal-500">
            <Link to="/blog" className="text-gold-500 underline">Back to blog</Link>.
          </p>
        </Section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Seo title={`${post.title} - Devansh Patel`} description={post.excerpt} />

      <Section spacing="lg">
        <Reveal>
          <Link to="/blog" className="caption text-gold-500 hover:text-charcoal-900">&lt;- Back to blog</Link>
          <p className="caption mt-6 text-charcoal-500">
            {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            {' / '}
            {post.readingMinutes} min read
          </p>
          <h1 className="mt-2 max-w-3xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <article className="max-w-prose space-y-6 text-body-lg leading-relaxed text-charcoal-700">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
