import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const oldPhoto = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
            //검색된 포토의 내용 들고오면서 + hashTag의 relation정보도 들고옴!
            //그냥 hashtags:true하면 모든 해쉬테그 정보를 다 가져옴
            //해쉬테그안에는 createdAt total~~ 많은게 있기떄문.
          },
        });
        if (!oldPhoto) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }
        await client.photo.update({
          //새로운 헤쉬가 들어온다면?
          where: {
            id,
          },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
