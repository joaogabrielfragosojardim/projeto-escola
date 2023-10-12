import { supabaseClient } from './supaBaseClient';

export const getImageInSupabase = (url: string) => {
  const { data } = supabaseClient.storage
    .from('project-school-bucket')
    .getPublicUrl(url);

  return data;
};
