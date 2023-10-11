import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import nookies, { destroyCookie } from 'nookies';
import React, { useEffect } from 'react';

import { axiosApi } from '@/components/api/axiosApi';

const Logout = () => {
  const route = useRouter();
  useEffect(() => {
    destroyCookie(null, 'token');
    axiosApi.defaults.headers.Authorization = null;
    route.push('/login');
  }, [route]);
  return <div />;
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  nookies.destroy(ctx, 'token');

  return {
    props: {},
  };
};

export default Logout;
