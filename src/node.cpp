#include <node_api.h>
#include <assert.h>
#include <windows.h>

#define DECLARE_NAPI_METHOD(name, func) \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_value getLastError(napi_env env, napi_callback_info args) {
	napi_status status;
	napi_value result;

	DWORD code = GetLastError();
	status = napi_create_uint32(env, code, &result);
	assert(napi_ok == status);
	return result;
}

napi_value init(napi_env env, napi_value exports) {
	napi_status status;
	napi_property_descriptor descArr[] = {
		DECLARE_NAPI_METHOD("getLastError", getLastError),
	};
	status = napi_define_properties(env, exports, sizeof(descArr) / sizeof(descArr[0]), descArr);
	assert(napi_ok == status);
	return exports;
}

NAPI_MODULE(getLastError, init)
