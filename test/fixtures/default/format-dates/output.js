import { __date } from "precompile-intl-runtime";
export default {
  nearby: "Find places near your location",
  default: start => `Sale begins ${__date(start)}`,
  custom: start => `Sale begins ${__date(start, "medium")}`
};