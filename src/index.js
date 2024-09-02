if ("win32" !== process.platform) {
	console.warn("[GetLastError] This library is Windows-only. Calling it in other platform will always return 0.");
	module.exports = () => 0;
} else {
	const addon = require("./" + process.arch + "/GetLastError");

	const prefix = {
		16: "0x", 8: "0o", 2: "0b",
	};

	/**
	 * Calls the windows 'GetLastError' function when failed calling other functions with `ffi` library.
	 *
	 * @param [base]      {number}  Number base(1 ~ 36) of the return value. Defaults to 10.
	 * @param [addPrefix] {boolean} Adds 0x if base is 16, 0o if 8, and 0b if 2. Defaults to false.
	 *
	 * @return {number|string}
	 */
	module.exports = function (base, addPrefix) {
		let code = addon.getLastError();
		if (base) {
			code = (addPrefix ? prefix[base] || "" : "") + code.toString(base);
		}
		return code;
	};
}
