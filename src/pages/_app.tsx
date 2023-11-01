import '@/styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import { parseCookies } from 'nookies';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { StoreProvider } from '@/store/StoreProvider';
import { notoSans, notoSerif } from '@/styles/fonts';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();

  if (!axiosApi.defaults.headers.Authorization) {
    const { token } = parseCookies();
    axiosApi.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <main
          className={`${notoSans.variable} ${notoSerif.variable} font-sans`}
        >
          <Component {...pageProps} />
          <ToastContainer />
        </main>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
