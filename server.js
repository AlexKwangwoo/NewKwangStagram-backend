require("dotenv").config();
// import dotenv from "dotenv"
// dotenv.config() require로 한줄을 만든것임!
import { getUser } from "./users/users.utils";
import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./schema";

const PORT = process.env.PORT;

//스키마 파일에서 typeDefs 와 리졸버,쿼리를 다햅해서 서버로 보내준다!
const server = new ApolloServer({
  resolvers,
  typeDefs,
  // schema, 파일업로드위해..resolver와 typeDefs로 나눠줌..readme설명있음
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      //getUser는 토큰을 받아서 user를 리턴한다.
      //개발환경. 디비만 할떄는 프론트에서 header에 포함 못시키기에
      //playgrond http Headers에 넣어서 보내준다!
      // protectResolver,
    };
  },
});

server
  .listen(PORT)
  .then(() =>
    console.log(`🚀Server is running on http://localhost:${PORT} ✅`)
  );
