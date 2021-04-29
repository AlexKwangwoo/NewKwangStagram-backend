require("dotenv").config();
// import dotenv from "dotenv"
// dotenv.config() require로 한줄을 만든것임!
import { getUser } from "./users/users.utils";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
//import { ApolloServer } from "apollo-server"; 아폴로서버 익스프레스로바뀜
import { typeDefs, resolvers } from "./schema";

const PORT = process.env.PORT;

//스키마 파일에서 typeDefs 와 리졸버,쿼리를 다햅해서 서버로 보내준다!
const apollo = new ApolloServer({
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

const app = express();
app.use(logger("tiny")); //매 시간마다 로그 찍히게 해줌..
//이밑에 applyMiddleware해줘여함

apollo.applyMiddleware({ app });
//아폴로 서버에게 익스프레스와 함께 일해라고 말해줌..
//ApolloServer가 apollo-server에서 오는게 아니라 apollo-server-express에서
//오는걸로 바꿨기 떄문에 가능함

app.use("/static", express.static("uploads"));
//업로드 파일을 가져올수있게 해줌
//localhost:4000/static/1231234.jpg 볼수가있음! static써줘야함!
//즉 /static으로 모든 파일들을 뭉쳐줄수있음

app.listen({ port: PORT }, () => {
  //앱을 listen시키면 자동적으로 apolloServer가 같이 오게된다!
  console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
});
