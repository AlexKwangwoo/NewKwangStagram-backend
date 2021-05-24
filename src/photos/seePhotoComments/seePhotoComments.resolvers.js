import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_, { id }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        // take, skip or cursor
        orderBy: {
          createdAt: "asc",
        },
      }),
  },
};
