import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    allUser: protectedResolver(async (_, { username }, { loggedInUser }) => {
      // console.log("username", username);
      // username는 없다.. alluser에는 적용대상이 누군지 모르기에.. 프로필선택시 선택된사람이 username일것임
      const allUserFound = await client.user.findMany({
        where: {
          NOT: {
            username: loggedInUser.username,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      // console.log("allUserFound", allUserFound);
      return allUserFound;
    }),
  },
};
