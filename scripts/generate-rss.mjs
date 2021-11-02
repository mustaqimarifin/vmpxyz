import { writeFileSync } from 'fs';
import RSS from 'rss';
import { allBlogs } from '.contentlayer/data';

async function generate() {
  const feed = new RSS({
    title: 'Mustaqim Arifin',
    site_url: 'https://mustaqimarifin.xyz',
    feed_url: 'https://mustaqimarifin.xyz/feed.xml'
  });

  allBlogs.map((post) => {
    feed.item({
      title: post.title,
      url: `https://mustaqimarifin.xyz/blog/${post.slug}`,
      date: post.publishedAt,
      description: post.summary
    });
  });

  writeFileSync('./public/feed.xml', feed.xml({ indent: true }));
}

generate();
