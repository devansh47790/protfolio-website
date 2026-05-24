import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Badge from '../components/ui/Badge';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { getBlogPostBySlug, getSiteSettings } from '../lib/cms';
import { blogPostingSchema, breadcrumbsSchema } from '../lib/seo';
import type { BlogBodyBlock, BlogPost, SiteSettings } from '../types/content';

function blockText(block: Extract<BlogBodyBlock, { _type: 'block' }>) {
  return block.children?.map((child) => child.text ?? '').join('') ?? '';
}

function BlogBody({ body }: { body: BlogBodyBlock[] }) {
  return (
    <article className="max-w-prose space-y-6 text-body-lg leading-relaxed text-charcoal-700">
      {body.map((block, i) => {
        if (typeof block === 'string') {
          return <p key={i}>{block}</p>;
        }

        const key = block._key ?? i;

        if (block._type === 'image') {
          if (!block.imageUrl) return null;
          return (
            <figure key={key} className="space-y-2">
              <img
                src={block.imageUrl}
                alt={block.alt ?? ''}
                loading="lazy"
                decoding="async"
                className="w-full border border-surface-400 object-cover"
              />
              {block.alt && <figcaption className="text-body-sm text-charcoal-500">{block.alt}</figcaption>}
            </figure>
          );
        }

        const text = blockText(block);
        if (!text) return null;

        if (block.style === 'h2') return <h2 key={key} className="text-h3 text-charcoal-900">{text}</h2>;
        if (block.style === 'h3') return <h3 key={key} className="text-h4 text-charcoal-900">{text}</h3>;
        if (block.style === 'blockquote') {
          return (
            <blockquote key={key} className="border-l-2 border-gold-300 pl-5 font-serif text-xl italic text-charcoal-700">
              {text}
            </blockquote>
          );
        }
        if (block.listItem === 'bullet') return <li key={key} className="ml-6 list-disc">{text}</li>;
        if (block.listItem === 'number') return <li key={key} className="ml-6 list-decimal">{text}</li>;

        return <p key={key}>{text}</p>;
      })}
    </article>
  );
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [site, setSite] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (!slug) return;
    getBlogPostBySlug(slug).then(setPost);
    getSiteSettings().then(setSite);
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
      <Seo
        title={post.seo?.title ?? `${post.title} | Devansh Patel`}
        description={post.seo?.description ?? post.excerpt}
        keywords={post.seo?.keywords ?? [...post.tags, 'web development journal', 'frontend notes']}
        path={`/blog/${post.slug}`}
        ogImageUrl={post.seo?.ogImageUrl ?? post.coverImageUrl}
        ogType="article"
      />
      {site && (
        <>
          <JsonLd id={`blog-${post.slug}`} data={blogPostingSchema(post, site)} />
          <JsonLd
            id={`breadcrumbs-blog-${post.slug}`}
            data={breadcrumbsSchema(site, [
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ])}
          />
        </>
      )}

      <Section spacing="lg">
        <Reveal>
          <Link to="/blog" className="caption text-gold-500 hover:text-charcoal-900">&lt;- Back to blog</Link>
          <p className="caption mt-6 text-charcoal-500">
            {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            {' / '}
            {post.readingMinutes} min read
          </p>
          <h1 className="mt-2 max-w-6xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </Reveal>
      </Section>

      <Section>
        <BlogBody body={post.body} />
      </Section>
    </PageTransition>
  );
}
