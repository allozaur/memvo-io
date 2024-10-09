import { redirect, type Handle } from '@sveltejs/kit';

const handleAuthGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// if (!event.locals.session) {
	// 	redirect(303, '/sign-in');
	// }

	if (event.locals.session && event.url.pathname === '/sign-in') {
		redirect(303, '/record');
	}

	return resolve(event);
};

export default handleAuthGuard;
