import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	depends,
	locals: { safeGetSession, supabase },
	cookies
}) => {
	const { session, user } = await safeGetSession();

	depends('get_user_recordings');

	const { data: recordingsData, error: recordingsError } = await supabase
		.from('user_recordings')
		.select()
		.eq('user_id', user?.id)
		.order('created_at', { ascending: false });

	let recordingsWithSignedUrls = [];

	if (recordingsError) {
		console.error(recordingsError);
	} else if (recordingsData) {
		recordingsWithSignedUrls = await Promise.all(
			recordingsData.map(async (recording) => {
				const { data: signedUrlData, error: signedUrlError } = await supabase.storage
					.from('user_recordings_audio_files')
					.createSignedUrl(`${recording.user_id}/${recording.audio_file_name}`, 60 * 60);

				if (signedUrlError) {
					console.error(signedUrlError);
					return recording;
				}

				return {
					...recording,
					url: signedUrlData.signedUrl
				};
			})
		);
	}

	return {
		cookies: cookies.getAll(),
		recordings: recordingsWithSignedUrls,
		session,
		user
	};
};
