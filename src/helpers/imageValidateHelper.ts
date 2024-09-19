export function validateImageTypes(
	type: string,
	validImageTypes: string[] = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
	]
): boolean {
	if (!validImageTypes.includes(type)) {
		return false;
	}

	return true;
}
