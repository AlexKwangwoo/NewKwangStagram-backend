import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword }) =>
      // *****나중에 여기 더 추가할거면 { +내용, return+내용} 해줘야함..
      // 그리고  client.user.findMany앞에 await붙여 줘야함!!
      client.user.findMany({
        where: {
          username: {
            mode: "insensitive",
            startsWith: keyword,
            //비교해줄때 소문자로 해주는데.. 찾을려는사람이 대문자가 섞이면?
          },
        },
      }),
  },
};
