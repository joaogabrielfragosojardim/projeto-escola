import { supabaseClient } from './supaBaseClient';

export const getImageInSupabase = (url: string) => {
  const { data } = supabaseClient.storage
    .from('escola-prime')
    .getPublicUrl(url);

  return data;
};
