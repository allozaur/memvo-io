import { t } from '@resider/i18n';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export function GET() {
  redirect(303, `/${get(t)('slugs.sign-in')}`);
}