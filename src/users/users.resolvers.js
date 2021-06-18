import client from "../client";

export default {
  //여기 값들이 typeDefs의 user테이블의 특정 필드값을 대처하거나 로직을
  // 거친후 값이 반환된다
  User: {
    //여기도 하나의 리졸버라고 생각하자!!
    totalFollowing: async (props) => {
      const id = props.id;
      console.log("propsprops", props);
      // 중요 props는 지금 로그인된 사람의 모든정보를 가져옴!!

      //root는 request된 User이다.. ex)seeProfile
      //반환값이 User여야만 한다..
      // const totalUser = null;
      const totalUser = await client.user.count({
        //다른사람들중 id팔로워를 가지고 있는사람들의 수를 셀것임
        //그것지 즉 id사람이 팔로워하는사람들 수가 될것이기에
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      });
      return totalUser;
    },

    totalFollowers: ({ id }) =>
      client.user.count({
        //다른사람들중 id를 팔로우하는사람들의 수를 셀것임
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),

    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },

    //------중요.. 만약 seeProfile에서 include안해주면 여길 on시켜야함!
    // followers: ({ id }) =>
    //   client.user.findUnique({ where: { id } }).followers(),

    // following: ({ id }) =>
    //   client.user.findUnique({ where: { id } }).following(),

    isFollowing: async ({ id }, _, { loggedInUser }) => {
      //여기서 id는 내가 지금 보고있는 사람의 id가 될것임
      if (!loggedInUser) {
        return false;
      }

      // const exists = await client.user
      //   .findUnique({ where: { username: loggedInUser.username } })
      //   .following({ where: { id } });
      //내가 팔로잉 하는사람들중에 내가 바라보는 id가 있는지 볼것임!
      //이렇게 해됨<!DOCTYPE html>

      const exists = await client.user.count({
        //일단 먼저 나를 찾고. 내가 팔로잉하는사람들중에
        //id가 있는지 찾는다.
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
    photos: ({ id }) =>
      client.user
        .findUnique({ where: { id } })
        .photos({ orderBy: { id: "desc" } }),
  },
};
// totalFollowers: (parent) => parent.followers.length,
// totalFollowing: (parent) => parent.following.length,
//이렇게 해도됨.
