import { __interpolate, __plural } from "precompile-intl-runtime";
export default {
  nearby: "Find places near your location",
  kilometer: count => `${__interpolate(count)} ${__plural(count, {
    1: "kilometer",
    other: "kilometers"
  })}`
};