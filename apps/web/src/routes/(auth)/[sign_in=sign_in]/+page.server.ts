import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	google_signin: async ({ locals, url }) => {
		const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				},
				redirectTo: `${url.origin}/oauth/google${url.search}`
			}
		});

		if (err) {
			console.log(err);

			return fail(400, {
				message: 'Something went wrong.'
			});
		}

		redirect(303, data.url);
	}
};
