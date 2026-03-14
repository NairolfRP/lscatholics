import Head from '@/shared/components/app-head'
import { Typography } from '@/shared/components/ui/typography'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import { formatDate } from '@/lib/utils'
import type { Data } from '@generated/data'
import { InertiaProps } from '@/types'

type PageProps = InertiaProps<{
  post: Data.Posts.Post.Variants['publicDetails']
}>

export default function NewsSinglePage({ post }: PageProps) {
  return (
    <>
      <Head title={post.title}>
        <meta head-key="og:type" property="og:type" content="article" />
        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        {post.publishedAt && <meta property="article:published_time" content={post.publishedAt} />}
        {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
        {post.category && <meta property="article:section" content={post.category} />}
      </Head>

      <article>
        <header>
          <HeroSection bgImage={post.coverImageUrl || undefined} py="16">
            <div className="flex flex-col gap-5">
              <Typography variant="h1" className="md:text-5xl font-bold mb-4">
                {post.title}
              </Typography>
              <p className="text-xl opacity-90">{post.excerpt}</p>
            </div>
          </HeroSection>
        </header>

        <div className="max-w-prose mx-auto px-10 sm:px-8 lg:px-0 py-12 lg:py-16">
          <div className="article-content">
            <div className="flex flex-col mb-10">
              <span className="font-bold uppercase">Pour diffusion immédiate</span>
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              )}
            </div>
            <MarkdownContent content={post.content} className="text-justify" />
          </div>
        </div>
      </article>
    </>
  )
}
