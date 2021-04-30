import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      console.log(likes);
      // const a = likes.map((like) => like.user);
      // console.log("aaaaaaaaaaa", a);
      return likes.map((like) => like.user);
      //[{user:{id,firstname},},{user:{id,firstname},},{user:{id,firstname},}]
      //우리는 [{id,firstname},{id,firstname},{id,firstname}]<-이게 받고싶음!
      //그래서 map을 사용한다
    },
  },
};
