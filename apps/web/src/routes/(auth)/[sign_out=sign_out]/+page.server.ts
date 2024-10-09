import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const { supabase } = locals;

	await supabase.auth.signOut({ scope: 'local' });

	redirect(303, '/');
};
