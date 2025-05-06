"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-any-array";
exports.ids = ["vendor-chunks/is-any-array"];
exports.modules = {

/***/ "(rsc)/./node_modules/is-any-array/lib-esm/index.js":
/*!****************************************************!*\
  !*** ./node_modules/is-any-array/lib-esm/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isAnyArray: () => (/* binding */ isAnyArray)\n/* harmony export */ });\n// eslint-disable-next-line @typescript-eslint/unbound-method\nconst toString = Object.prototype.toString;\n/**\n * Checks if an object is an instance of an Array (array or typed array, except those that contain bigint values).\n *\n * @param value - Object to check.\n * @returns True if the object is an array or a typed array.\n */ function isAnyArray(value) {\n    const tag = toString.call(value);\n    return tag.endsWith(\"Array]\") && !tag.includes(\"Big\");\n} //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaXMtYW55LWFycmF5L2xpYi1lc20vaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLDZEQUE2RDtBQUM3RCxNQUFNQSxXQUFXQyxPQUFPQyxTQUFTLENBQUNGLFFBQVE7QUFDMUM7Ozs7O0NBS0MsR0FDTSxTQUFTRyxXQUFXQyxLQUFLO0lBQzVCLE1BQU1DLE1BQU1MLFNBQVNNLElBQUksQ0FBQ0Y7SUFDMUIsT0FBT0MsSUFBSUUsUUFBUSxDQUFDLGFBQWEsQ0FBQ0YsSUFBSUcsUUFBUSxDQUFDO0FBQ25ELEVBQ0EsaUNBQWlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGFyZHdhcmUtZG9jLWNoYXRib3QvLi9ub2RlX21vZHVsZXMvaXMtYW55LWFycmF5L2xpYi1lc20vaW5kZXguanM/Y2FkYiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3VuYm91bmQtbWV0aG9kXG5jb25zdCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4vKipcbiAqIENoZWNrcyBpZiBhbiBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYW4gQXJyYXkgKGFycmF5IG9yIHR5cGVkIGFycmF5LCBleGNlcHQgdGhvc2UgdGhhdCBjb250YWluIGJpZ2ludCB2YWx1ZXMpLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIE9iamVjdCB0byBjaGVjay5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIG9iamVjdCBpcyBhbiBhcnJheSBvciBhIHR5cGVkIGFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBbnlBcnJheSh2YWx1ZSkge1xuICAgIGNvbnN0IHRhZyA9IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgIHJldHVybiB0YWcuZW5kc1dpdGgoJ0FycmF5XScpICYmICF0YWcuaW5jbHVkZXMoJ0JpZycpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbInRvU3RyaW5nIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaXNBbnlBcnJheSIsInZhbHVlIiwidGFnIiwiY2FsbCIsImVuZHNXaXRoIiwiaW5jbHVkZXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/is-any-array/lib-esm/index.js\n");

/***/ })

};
;