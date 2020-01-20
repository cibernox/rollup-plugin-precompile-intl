import { __select } from "precompile-intl-runtime";
export default {
  nearby: "Find places near your location",
  kilometer: gender => `This year ${__select(gender, {
    male: "he made many kilometers",
    female: "she made many kilometers",
    other: "they made many kilometers"
  })}`,
  good: gender => __select(gender, {
    male: "He is a good boy",
    female: "She is a good girl",
    other: "They are good fellas"
  })
};