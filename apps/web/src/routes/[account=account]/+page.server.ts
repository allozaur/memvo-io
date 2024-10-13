import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/sign-in-with-google');

	return {
		recordings: []
	};
};
