import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, locals, url }) => {
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next = cookies.get('post_signup_redirect_url');

  // @ts-ignore
  const { error: err } = await locals.supabase.auth.verifyOtp({ token_hash, type });

  if (!err) {
    redirect(303, `${next}`);
  }

  error(500, err);
};
