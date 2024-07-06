import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
	const n = Number(params.slug);
	if (isNaN(n))
		error(400, {
			message: `${n} is not a number`
		});
	if (n < 0)
		error(400, {
			message: `${n} is negative`
		});
	if (n % 1 !== 0)
		error(400, {
			message: `${n} is not an integer`
		});
	if (n > 10000000)
		error(400, {
			message: `${n} is too big`
		});
	return {
		n
	};
};
