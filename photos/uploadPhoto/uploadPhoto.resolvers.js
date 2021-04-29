import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];

        if (caption) {
          // parse caption
          // get or create Hashtags(캡션속에 해시태그가 존재하거나 없을때!)
          const hashtags = caption.match(/#[\w]+/g);
          // console.log(hashtags);
          if (hashtags) {
            hashtagObj = hashtags.map((hashtag) => ({
              where: { hashtag },
              create: { hashtag },
            }));
          }

          //where: { hashtag }, create: { hashtag } 가진 배열을 만들어줄것임
        }
        // save the photo WITH the parsed hashtags
        // add the photo to the hashtags
        return client.photo.create({
          data: {
            file,
            caption,
            // hashtags: {
            //   connectOrCreate: [
            //     //있으면 연결하고 없으면 만든다!
            //     //무조건 유닉크한 값만 사용할수있다
            //     {
            //       where: {
            //         hashtag: "#food",
            //       },
            //       create: {
            //         hashtag: "#food",
            //       },
            //     },
            //   ],
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
                //오브젝트들이 들어간 배열로 connectOrCreate에 넣어줄수있음
              },
            }),
          },
          // include: {
          //   user: true,
          //   hashtags:true,
          // },<-- photo 리졸버 안만들고 이렇게도 가능!
        });
      }
    ),
  },
};
