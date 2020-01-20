import { __plural } from "precompile-intl-runtime";
export default {
  nearby: "Find places near your location",
  kilometer: count => __plural(count, {
    one: "just one kilometer",
    few: `just ${count} kilometres`,
    other: `${count} kilometers easily`
  })
};