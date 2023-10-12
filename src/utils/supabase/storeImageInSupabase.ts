import { supabaseClient } from './supaBaseClient';

export const storeImageInSupabase = async (file: File) => {
  const { data } = await supabaseClient.storage
    .from('project-school-bucket')
    .upload(`${file.name}-${new Date().getTime()}`, file);
  return data;
};
