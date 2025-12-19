import React from 'react';
import BlogPostCard from './BlogPostCard';
import { World } from '../App';

interface BlogFeedProps {
  world: World;
}

const blogPosts = [
  { id: 1, title: 'Temporal Mechanics in UI Design', date: '2024-10-28', tags: ['UI/UX', 'Time', 'Retro'], excerpt: 'Exploring how concepts of time manipulation can influence user interface design, creating dynamic and responsive experiences that guide user perception and interaction flow.' },
  { id: 2, title: 'The Aesthetics of a Frozen Moment', date: '2024-10-22', tags: ['Design', 'Theory', 'Sakuya'], excerpt: 'A deep dive into the visual language of stopped time, from color theory to the illusion of motion in static imagery. We analyze how to convey action and intent in a single frame.' },
  { id: 3, title: 'PC-98 Era: A Digital Archeology', date: '2024-10-15', tags: ['History', 'Tech', 'PixelArt'], excerpt: 'Uncovering the design principles of the PC-98 and how its strict limitations fostered a unique and enduring visual style that continues to inspire creators today.' },
  { id: 4, title: 'Project "Silver Phantom": A Case Study', date: '2024-10-09', tags: ['Case Study', 'React', 'Performance'], excerpt: 'Detailed breakdown of a high-performance web application, focusing on state management strategies and render optimization techniques for a flawless user experience.' },
];

const BlogFeed: React.FC<BlogFeedProps> = ({ world }) => {
  return (
    <section id="blog-feed">
      <div className="space-y-8">
        {blogPosts.map(post => (
          <BlogPostCard key={post.id} post={post} world={world} />
        ))}
      </div>
    </section>
  );
};

export default BlogFeed;