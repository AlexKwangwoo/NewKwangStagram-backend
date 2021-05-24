import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
      // 메시지 안읽은거 읽음 표시로 바꾸는게 주목적!
      const message = await client.message.findFirst({
        where: {
          id,
          userId: {
            not: loggedInUser.id,
          }, //내가 보낸 메시지가 아니고
          room: {
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          }, //내가 현재 그채팅방 손님이거나 주인일때
        },
        select: {
          id: true,
        },
      });
      if (!message) {
        return {
          ok: false,
          error: "Message not found.",
        };
      }
      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
