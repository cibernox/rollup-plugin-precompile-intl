import { __plural } from "precompile-intl-runtime";
export default {
  gym: trainers => __plural(trainers, 1, {
    0: "The gym is empty",
    1: "You are alone here",
    one: `You and ${trainers - 1} trainer`,
    other: `You and ${trainers - 1} other trainers`
  }),
  gymAndBasket: (friends, trainers) => __plural(trainers, 1, {
    0: "The gym is empty",
    1: "You are alone here",
    one: `You and ${trainers - 1} trainer`,
    other: `You and ${trainers - 1} other trainers ${__plural(friends, 4, {
      0: "and you need 4 more to form a basket team",
      1: "and you need 3 more to play a basket game",
      2: "and you need 2 more to play a basket game",
      3: "and you need 1 more to play a basket game",
      4: "and you have enough mates to play a basket game",
      other: `and you can play a basket game and have ${friends - 4} players in the bench`
    })}`
  })
};