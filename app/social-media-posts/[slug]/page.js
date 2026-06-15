import { notFound } from 'next/navigation';
import {
  SOCIAL_POSTS,
  findSocialPostBySlug,
  getAdjacentSocialPosts,
} from '../../lib/social-posts-data';
import SocialPostDetailClient from './SocialPostDetailClient';

export function generateStaticParams() {
  return SOCIAL_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = findSocialPostBySlug(slug);
  if (!post) return { title: 'Social Post — Veto · Reyna for Nevada' };
  return {
    title: `${post.title} — Social Library · Veto`,
    description: post.summary,
  };
}

export default async function SocialPostDetailPage({ params }) {
  const { slug } = await params;
  const post = findSocialPostBySlug(slug);
  if (!post) notFound();
  const { prev, next } = getAdjacentSocialPosts(slug);
  return <SocialPostDetailClient post={post} prev={prev} next={next} />;
}
