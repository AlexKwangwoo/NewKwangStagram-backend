import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        // where: 어떤 포토인지를 가서!!! 포토안의 user내용만 뽑아오겠음// 사진 정보도
        //얻어 오고 싶다면 include하던가 select에 user photo 둘다 해줘야함~!
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
