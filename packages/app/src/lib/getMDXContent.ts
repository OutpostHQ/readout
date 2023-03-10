import { remarkCodeHike } from '@code-hike/mdx';
import { Octokit } from 'octokit';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { bundle } from './bundler/bundler';
import theme from 'shiki/themes/material-palenight.json';

async function getMdxContent(
  owner: string,
  repoName: string,
  page: string = 'index',
  path: string = 'docs'
) {
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  let route = `/${path}/${page}.mdx`;
  const { data }: any = await octokit.rest.repos.getContent({
    owner: owner,
    repo: repoName,
    path: route,
  });
  let mdx;

  if (Array.isArray(data)) {
    mdx = Buffer.from(data[0].content!, 'base64').toString('ascii');
  } else {
    mdx = Buffer.from(data?.content, 'base64').toString('ascii');
  }

  let pageContent = await bundle(mdx, {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    remarkPlugins: [[remarkCodeHike, { showCopyButton: true, theme }]],
    headerDepth: 3,
  });
  return pageContent;
}

export { getMdxContent };
