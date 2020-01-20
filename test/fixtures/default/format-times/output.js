import { __time } from "precompile-intl-runtime";
export default {
  nearby: "Find places near your location",
  default: expires => `Coupon expires at ${__time(expires)}`,
  custom: expires => `Coupon expires at ${__time(expires, "medium")}`
};