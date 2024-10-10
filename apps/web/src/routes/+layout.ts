import { env as envPublic } from '$env/dynamic/public';
import type { LayoutLoad } from './$types';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const { recordings, user } = data;

	const supabase = isBrowser()
		? createBrowserClient(envPublic.PUBLIC_SUPABASE_URL, envPublic.PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(envPublic.PUBLIC_SUPABASE_URL, envPublic.PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { recordings, supabase, session, user };
};
