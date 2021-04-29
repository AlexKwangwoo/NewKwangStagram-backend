import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
        //그냥 유저가 있는지 없는지만 확인할려는데 모든정보가 다온다..
        //비효율적임.. 그래서 select 는 특정 필드를 선택가능하게 해줌!
        //id:true하면 아이디만 가져오게해줌!
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        // 유저들중.. username을 팔로잉하고있는사람을 찾으면
        // username의 모든 팔로워를 찾을수있다!
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
