import { __interpolate, __plural, __select } from "precompile-intl-runtime";
export var foot = count => `${__interpolate(count)} ${__plural(count, {
  one: "foot",
  other: "feet"
})}`;
export default {
  nearby: "Find places near your location",
  kilometer: (count, gender) => `This year ${__select(gender, {
    male: `he made ${__plural(count, {
      0: "no kilometres",
      one: "one kilometre",
      other: `${__interpolate(count)} kilometres`
    })}`,
    female: `she made ${__plural(count, {
      0: "no kilometres",
      one: "one kilometre",
      other: `${__interpolate(count)} kilometres`
    })}`,
    other: `they made ${__plural(count, {
      0: "no kilometres",
      one: "one kilometre",
      other: `${__interpolate(count)} kilometres`
    })}`
  })}`,
  foot
};