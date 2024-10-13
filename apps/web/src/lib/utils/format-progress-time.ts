export default function formatProgressTime(time: number) {
	return [
		Math.floor((time % 3600000) / 60000), // minutes
		Math.floor((time % 60000) / 1000) // seconds
	]
		.map((v) => (v < 10 ? '0' + v : v))
		.join(':');
}
