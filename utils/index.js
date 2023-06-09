const sab = new SharedArrayBuffer(4);
export function sleep(ms) {
	Atomics.wait(new Int32Array(sab), 0, 0, ms);
}

export function getRandomNumber(num) {
	return Math.floor(Math.random() * num) + 1
}