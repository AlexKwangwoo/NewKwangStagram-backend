import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeFeed: protectedResolver((_, __, { loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            //둘중 하나의 조건이라도 만족되는 사진들을 가져온다
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              userId: loggedInUser.id,
              // 내자신이 올린것도 피드에서 볼수있음!
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};
