/**
 * @module
 *
 * Calls the win32 `GetLastError` function when failed calling other win32 api function with `ffi-napi` library.
 *
 * Unfortunately, you cannot use the async mode of the specific function if you want to get the error code,
 * because the `ffi-napi` library will also call some apis that will clear the error.
 *
 * To successfully get the error code, please use the sync mode of the specific function.
 */

const ffi = require("ffi-napi");
const getLastError = require("getLastError");

const user32 = ffi.Library("user32.dll", {
	LoadIconA: ["size_t"/* HICON */, [
		"size_t", /* HINSTANCE hInstance  */
		"string", /* LPCSTR    lpIconName */
	]],
	LoadImageA: ["size_t"/* HANDLE */, [
		"size_t", /* HINSTANCE hInst  */
		"string", /* LPCSTR    name   */
		"uint32", /* UINT      type   */
		"int32",  /* int       cx     */
		"int32",  /* int       cy     */
		"uint32", /* UINT      fuLoad */
	]],
});

if (0 === user32.LoadIconA(0, "notExists.ico")) {
	console.log(getLastError(16, true));	// 0x715
}

if (0 === user32.LoadImageA(0, "notExists.ico", IMAGE_ICON = 1, 16, 16, (LR_LOADFROMFILE = 0x10) | (LR_LOADTRANSPARENT = 0x20))) {
	console.log(getLastError(16));	// 2
}

// Do NOT use async, because the `ffi-napi` library will also call some apis that will clear the error.
user32.LoadImageA.async(0, "notExists.ico", IMAGE_ICON, 16, 16, LR_LOADFROMFILE | LR_LOADTRANSPARENT, (err, r) => {
	if (0 === r) {
		console.log("you will never get the correct error code in callback mode:", getLastError(16));
	}
});
