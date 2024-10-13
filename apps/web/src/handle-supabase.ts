import { createServerClient } from '@supabase/ssr';
import { env as envPrivate } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

const handleSupabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		`${envPublic.PUBLIC_SUPABASE_URL}`,
		`${envPrivate.SUPABASE_SERVICE_KEY ?? envPublic.PUBLIC_SUPABASE_ANON_KEY}`,
		{
			cookies: {
				getAll() {
					return event.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/' })
					);
				}
			}
		}
	);

	return resolve(event, {
		filterSerializedResponseHeaders(name: string) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

export default handleSupabase;
