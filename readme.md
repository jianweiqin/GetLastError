# getLastError

Calls the windows `GetLastError` function when failed calling other functions with `ffi-napi` library.

Unfortunately, you cannot use the async mode of the specific function if you want to get the error code, because the `ffi-napi` library will also call some apis that will clear the error.

To successfully get the error code, please use the sync mode of the specific function.

**This project was born as an experiment to learn C++, so consider that there might be bugs, leaks and so on.**

## Install

Just issue from the command line:

    > npm install getLastError

Note that this project contains native addons, which are prebuilt for the x86 and x64 versions and included in the package. If you want to rebuild, use:

* Microsoft Visual Studio C++ 2019 (maybe lower, but I didn't test)

## Getting started

```js
const ffi = require('ffi-napi');
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
```

## API

### Syntax

```js
getLastError(base, addPrefix);
```

### Parameters

- `base` [optional] {number}. Number base(1 ~ 36) of the return value. Defaults to `10`.
- `addPrefix` [optional] {boolean}. Adds 0x if base is 16, 0o if 8, and 0b if 2. Defaults to `false`.

### Returns

Type: string|number

The last error code calling windows api, in the specific number base.
