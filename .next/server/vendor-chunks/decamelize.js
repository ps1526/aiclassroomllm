"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/decamelize";
exports.ids = ["vendor-chunks/decamelize"];
exports.modules = {

/***/ "(rsc)/./node_modules/decamelize/index.js":
/*!******************************************!*\
  !*** ./node_modules/decamelize/index.js ***!
  \******************************************/
/***/ ((module) => {

eval("\nmodule.exports = function(str, sep) {\n    if (typeof str !== \"string\") {\n        throw new TypeError(\"Expected a string\");\n    }\n    sep = typeof sep === \"undefined\" ? \"_\" : sep;\n    return str.replace(/([a-z\\d])([A-Z])/g, \"$1\" + sep + \"$2\").replace(/([A-Z]+)([A-Z][a-z\\d]+)/g, \"$1\" + sep + \"$2\").toLowerCase();\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZGVjYW1lbGl6ZS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBQSxPQUFPQyxPQUFPLEdBQUcsU0FBVUMsR0FBRyxFQUFFQyxHQUFHO0lBQ2xDLElBQUksT0FBT0QsUUFBUSxVQUFVO1FBQzVCLE1BQU0sSUFBSUUsVUFBVTtJQUNyQjtJQUVBRCxNQUFNLE9BQU9BLFFBQVEsY0FBYyxNQUFNQTtJQUV6QyxPQUFPRCxJQUNMRyxPQUFPLENBQUMscUJBQXFCLE9BQU9GLE1BQU0sTUFDMUNFLE9BQU8sQ0FBQyw0QkFBNEIsT0FBT0YsTUFBTSxNQUNqREcsV0FBVztBQUNkIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGFyZHdhcmUtZG9jLWNoYXRib3QvLi9ub2RlX21vZHVsZXMvZGVjYW1lbGl6ZS9pbmRleC5qcz80MjljIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgc2VwKSB7XG5cdGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRzZXAgPSB0eXBlb2Ygc2VwID09PSAndW5kZWZpbmVkJyA/ICdfJyA6IHNlcDtcblxuXHRyZXR1cm4gc3RyXG5cdFx0LnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0pL2csICckMScgKyBzZXAgKyAnJDInKVxuXHRcdC5yZXBsYWNlKC8oW0EtWl0rKShbQS1aXVthLXpcXGRdKykvZywgJyQxJyArIHNlcCArICckMicpXG5cdFx0LnRvTG93ZXJDYXNlKCk7XG59O1xuIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJzdHIiLCJzZXAiLCJUeXBlRXJyb3IiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/decamelize/index.js\n");

/***/ })

};
;