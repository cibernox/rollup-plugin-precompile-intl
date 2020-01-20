import { __interpolate } from "precompile-intl-runtime";
export default {
  nearby: "Find places near your location",
  kilometer: count => `${__interpolate(count)} kilometers`,
  exactDistance: (cm, km, m) => `${__interpolate(km)}km, ${__interpolate(m)} meters and ${__interpolate(cm)} centimeters`
};