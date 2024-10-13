import { sequence } from '@sveltejs/kit/hooks';
import handleSupabase from './handle-supabase';
import type { HandleServerError } from '@sveltejs/kit';

export const handle = sequence(handleSupabase);

export const handleError: HandleServerError = async ({ error }) => {
	return {
		message: `${error}`
	};
};
