import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        //그 방의!! 내메시지 제외하고!! 읽은게 false인거 총합
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
              //내메시지 제외
            },
          },
        },
      });
    },
  },

  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
