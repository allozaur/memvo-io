import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return /^record$/.test(param);
};
