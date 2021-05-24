import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    followUser: protectedResolver(async (_, { username }, { loggedInUser }) => {
      const ok = await client.user.findUnique({ where: { username } });
      if (!ok) {
        return {
          ok: false,
          error: "That user does not exist.",
        };
      }
      if (loggedInUser.username === username) {
        return {
          ok: false,
          error: "You cannot follow youself",
        };
      }
      await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          following: {
            connect: {
              //connect하면 자동으로 상대방도 follower가 늘어남
              //이유는 싱글 relation 관계이기에..
              //follower나 following이나 둘중하나만 업데이트해도 다른쪽이 업데이트됨
              username,
              //unique값으로만 컨낵가능.. ex)email,username
            },
          },
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
