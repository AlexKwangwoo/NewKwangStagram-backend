import client from "../../client";

export default {
  Query: {
    seeProfile: (_, { username }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          //include는 내가 원하는 사용자 관계를 갖고 올수있게 해준다
          following: true,
          //내가 following 중인 사용자들만 include하라고 얘기하는것임
          //디폴트는 false임!
          //안써주면..null되어버림 관계는 직접 써줘야함..
          //만약 팔로잉이 1억명이면..?

          followers: true,
        },
      }),
  },
};
