import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    toggleLike: protectedResolver(async (_, { id }, { loggedInUser }) => {
      //팔로우 언팔로우는 두개를 만들었지만 여기서는 하나로 unlike like만들어보자
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found",
        };
      }
      const likeWhere = {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      }; //이부분이!!  @@unique([photoId, userId]) 을통해 사용가능하게해줌
      const like = await client.like.findUnique({
        where: likeWhere,
      });
      if (like) {
        await client.like.delete({
          //헤쉬는 delete하면안되기에 disconnect만 해줬지만
          //like는 지워져야해서 delete를 써야함!
          where: likeWhere,
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};
