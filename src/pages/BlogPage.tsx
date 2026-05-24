import { useEffect, useState } from 'react';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { getBlogPosts, getSiteSettings } from '../lib/cms';
import { breadcrumbsSchema } from '../lib/seo';
import type { BlogPost, SiteSettings } from '../types/content';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | undefined>(undefined);
  const [site, setSite] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getBlogPosts().then(setPosts);
    getSiteSettings().then(setSite);
  }, []);

  return (
    <PageTransition>
      <Seo
        title="Journal | WordPress, React & Web Craft"
        description="Notes from Devansh Patel on WordPress builds, React frontends, API integrations, performance, SEO, and practical website craft."
        keywords={['WordPress journal', 'React notes', 'API integration', 'frontend development', 'website performance SEO']}
        path="/blog"
      />
      {site && (
        <JsonLd
          id="breadcrumbs-blog"
          data={breadcrumbsSchema(site, [
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ])}
        />
      )}

      <Section
        spacing="lg"
        eyebrow="Journal"
        heading="Notes on web craft"
        headingLevel="h1"
        description="Practical notes on WordPress builds, React frontends, API integrations, performance, SEO, and maintainable website craft."
      >
        {posts === undefined ? (
          <p className="text-charcoal-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <Reveal key={post._id} delay={index * 0.05}>
                <Card hoverable className="flex h-full flex-col">
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt || `${post.title} article cover image`}
                      loading="lazy"
                      decoding="async"
                      className="-mx-8 -mt-8 mb-7 aspect-[16/9] w-[calc(100%+4rem)] object-cover"
                    />
                  )}
                  <p className="caption text-charcoal-500">
                    {formatDate(post.publishedAt)}
                    {' / '}
                    {post.readingMinutes} min read
                  </p>
                  <h2 className="mt-3 text-h3">{post.title}</h2>
                  <p className="mt-4 flex-1 text-body-lg text-charcoal-500">{post.excerpt}</p>
                  {post.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-7">
                    <Button to={`/blog/${post.slug}`} variant="text">
                      Read article
                    </Button>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="border border-surface-400 bg-surface-100 p-8 md:p-12">
              <h2 className="text-h3">Notes are coming soon</h2>
              <p className="mt-4 text-body-lg text-charcoal-500">
                This section is ready for published posts from Sanity.
              </p>
              <div className="mt-8">
                <Button to="/contact" variant="secondary">Suggest a topic</Button>
              </div>
            </div>
          </Reveal>
        )}
      </Section>
    </PageTransition>
  );
}
