import { getMDXComponent } from 'mdx-bundler/client';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import DocsLayout from '../../components/shared/Layouts/DocsLayout';
import { getMdxContent } from '../../lib/getMDXContent';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = context.params?.user as string;
  const username = user.split('-')[0];
  const repo = user.split('-')[1];
  const page = await getMdxContent(username, repo);

  return {
    props: {
      resultMDX: JSON.stringify(page),
      username,
      repo,
    } as const,
  };
}

function Docs({ resultMDX = '', username, repo }: InferGetServerSidePropsType<GetServerSideProps>) {
  const router = useRouter();

  if (!username || !repo) {
    router.push('404');
  }

  let parsedPage = JSON.parse(resultMDX);

  const Component = useMemo(() => getMDXComponent(parsedPage.code), [parsedPage.code]);
  return (
    <DocsLayout pageTitle={parsedPage.frontmatter.title || ''}>
      <Component />
    </DocsLayout>
  );
}

export default Docs;
