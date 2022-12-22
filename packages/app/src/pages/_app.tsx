import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { BreakpointsProvider, Root, SSRProvider } from '@cube-dev/ui-kit';
import Layout from '../components/shared/Layouts/Layout';
import '@code-hike/mdx/dist/index.css';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SSRProvider>
      <Root bodyStyles={{ 'background-color': '#121312' }}>
        <BreakpointsProvider value={[1140, 900, 500]}>
          {router.asPath !== '/' ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </BreakpointsProvider>
      </Root>
    </SSRProvider>
  );
}
