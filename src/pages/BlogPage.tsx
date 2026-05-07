import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Seo from '../components/seo/Seo';
import { useContent } from '../hooks/useContent';
import { getBlogPosts } from '../lib/cms';

export default function BlogPage() {
  const { data: posts } = useContent(getBlogPosts);

  return (
    <PageTransition>
      <Seo title="Blog - Devansh Patel" description="Notes on frontend, design systems, and craft." />

      <Section
        spacing="lg"
        eyebrow="Blog"
        heading="Notes from the workbench"
        description="Short writing on frontend, design systems, and the things I'm figuring out."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {posts?.map((post, i) => (
            <Reveal key={post._id} delay={i * 0.05}>
              <Link to={`/blog/${post.slug}`} className="block">
                <Card hoverable>
                  <p className="caption text-charcoal-500">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    {' / '}
                    {post.readingMinutes} min read
                  </p>
                  <h2 className="mt-2 text-h3">{post.title}</h2>
                  <p className="mt-3 text-body-md text-charcoal-500">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageTransition>
  );
}
