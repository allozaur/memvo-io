import { sequence } from '@sveltejs/kit/hooks';
import handleSupabase from './handle-supabase';
import handleAuthGuard from './handle-auth-guard';
import type { HandleServerError } from '@sveltejs/kit';

export const handle = sequence(handleSupabase, handleAuthGuard);

export const handleError: HandleServerError = async ({ error }) => {
	return {
		message: `${error}`
	};
};
