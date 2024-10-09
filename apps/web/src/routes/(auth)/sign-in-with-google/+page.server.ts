import { error, type ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, url }) => {
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

		error(400);
	}

	return redirect(303, data.url);
};
