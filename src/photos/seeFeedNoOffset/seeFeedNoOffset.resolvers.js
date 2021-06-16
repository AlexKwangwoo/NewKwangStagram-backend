import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

// export default {
//   Query: {
//     seeFeed: protectedResolver((_, { offset }, { loggedInUser }) =>
//       client.photo.findMany({
//         take: 4,
//         skip: offset,
//         // offset 만큼 스킵할것임!! 가져오는건 매번 2장씩만..
//         where: {
//           OR: [
//             //둘중 하나의 조건이라도 만족되는 사진들을 가져온다
//             //1. 내가 팔로우 하는사람의 사진
//             {
//               user: {
//                 followers: {
//                   some: {
//                     id: loggedInUser.id,
//                   },
//                 },
//               },
//             },
//             {
//               userId: loggedInUser.id,
//               // 2.내자신이 올린것도 피드에서 볼수있음!
//             },
//           ],
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       })
//     ),
//   },
// };

export default {
  Query: {
    seeFeedNoOffset: protectedResolver((_, __, { loggedInUser }) =>
      client.photo.findMany({
        // take: 8,
        // skip: offset,
        // offset 만큼 스킵할것임!! 가져오는건 매번 4장씩만..
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};
