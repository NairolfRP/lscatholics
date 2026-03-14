import { test } from '@japa/runner'
import { PostFactory } from '#database/factories/post_factory'
import Post from '#posts/models/post'

test.group('Post - generateUniqueSlug', (group) => {
  group.each.teardown(async () => {
    await Post.query().delete()
  })

  test('generates a slug from the title', async ({ assert }) => {
    const post = await PostFactory.merge({
      title: 'My First Post',
      slug: '',
      status: 'draft',
    }).create()

    assert.equal(post.slug, 'my-first-post')
  })

  test('strips accents from the title', async ({ assert }) => {
    const post = await PostFactory.merge({
      title: 'Événement Été',
      slug: '',
      status: 'draft',
    }).create()

    assert.equal(post.slug, 'evenement-ete')
  })

  test('appends a numeric suffix on slug collision', async ({ assert }) => {
    await PostFactory.merge({ slug: 'my-post', status: 'draft' }).create()
    const post = await PostFactory.merge({
      title: 'My Post',
      slug: '',
      status: 'draft',
    }).create()

    assert.equal(post.slug, 'my-post-2')
  })

  test('increments the suffix correctly across multiple collisions', async ({ assert }) => {
    await PostFactory.merge({ slug: 'post', status: 'draft' }).create()
    await PostFactory.merge({ slug: 'post-2', status: 'draft' }).create()

    const post = await PostFactory.merge({
      title: 'Post',
      slug: '',
      status: 'draft',
    }).create()

    assert.equal(post.slug, 'post-3')
  })

  test('does not override an explicitly provided slug', async ({ assert }) => {
    const post = await PostFactory.merge({
      title: 'My Post',
      slug: 'custom-slug',
      status: 'draft',
    }).create()

    assert.equal(post.slug, 'custom-slug')
  })
})
