require("dotenv").config();
// import dotenv from "dotenv"
// dotenv.config() require로 한줄을 만든것임!
//이것때문에 전파일에서 process.env. 사용가능
import { graphqlUploadExpress } from "graphql-upload";
import { getUser } from "./users/users.utils";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
//import { ApolloServer } from "apollo-server"; 아폴로서버 익스프레스로바뀜
import { typeDefs, resolvers } from "./schema";
import http from "http";

// import pubsub from "./pubsub";

const PORT = process.env.PORT;

//스키마 파일에서 typeDefs 와 리졸버,쿼리를 다햅해서 서버로 보내준다!
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  playground: true,
  //이걸 false하면 배포시 ~~/graphql 주소로 이동못함.. 근데 배포시엔 막아야 다른사람 접근막을수있음
  introspection: true,
  //위에것도 해줘야 배포시 doc과 schema에 접근가능함!
  uploads: false,
  //현재 upload가 버그가 많아 여기꺼 해제시키고 최신
  //import { graphqlUploadExpress } from 'graphql-upload'; 을 쓸것임
  // schema, 파일업로드위해..resolver와 typeDefs로 나눠줌..readme설명있음
  // app.use(graphqlUploadExpress());
  context: async (ctx) => {
    // ctx 에 req있으면 쿼리나 뮤테이션 connection있으면 소켓을쓴거

    //이부분 중요!!!!!!!!!!!!!!!!!!!
    //context는 mutation query subscribe 발생시 항상 발동됨.
    // header또는 connection을 포함하진않고!!!!! 같이!! 인자로 header와
    // connection을 가지고 올수있음..ex)ctx 그래서 그 인자를 이용해
    //context 자체에 넣을수있음(처음부터 포함되서 오는거 아님..인자로만불러옴)
    //그래서 리턴을 한다는말이.. context에 집에 넣겟다는거임
    if (ctx.req) {
      //req가 있따는말은 실시간이아니라 mutation이나 쿼리임!
      //즉 실시간 ws웹소켓 쓸때는 req가 없기에 req.headers.token이 undefined가되버림
      //웹소켓은 req res가 없음!
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
        //getUser는 토큰을 받아서 user를 리턴한다.
        //개발환경. 디비만 할떄는 프론트에서 header에 포함 못시키기에
        //playgrond http Headers에 넣어서 보내준다!
        // protectResolver,
      };
    } else {
      const {
        connection: { context },
        //req가 없이 connection이 있다는말은 웹소켓..실시간에서 온것이란뜻임
        //ctx에 있는 connection에서 context를 꺼내겠음
        //이context와 apollo context는 다른것임
        //참고로 이친구는 subscriptions밑에꺼..의 onConnect에서 일어난일임
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
        //아폴로 context 에 loggedInUse+내용을 넣어 주겠음
      };
    }
  },

  subscriptions: {
    //실시간(listening) 일어나면 여기서 반응을함
    onConnect: async ({ token }) => {
      //onConnect는 connection이 이뤄지는 순간에 우리에게 http header를 줌!
      //여기서 http req header를 끌어옴..
      //(그 헤더에.. token이 있는데.. 궁금한건 프론트앤드에서 과연
      //광디쉬처럼 구분해서 줄건지..같이보낼껀지?)
      //여기는 한번만 연결되어계속 살아있지만..
      //http header는 한번쓰고 죽고 다시 보내고 죽고임
      // onConnect는 user가 연결되었을때 사람들이 뭔가를 할 수 있도록 해주는 기능임.
      //첫번째 인자는 httpHeader의 내용을 가져옴 //백앤드에서 안넣어주고
      //플레이 그라운드에서 넣어줬음.. 프론트 만들면 거기서 보낼것임
      if (!token) {
        //로그인안해서 토큰없으면 연결조차도 에러내야함
        //퍼블릭으로 할려면(로그인없이) 이부분을 지워야함
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token);
      //user.util에 저장해놓은getUser로 토큰통해 user를 가져오자
      return {
        loggedInUser,
        //-> 여기서 ctx.connection.context.loggedInUser이 생기게됨
        //그걸 위에서 풀어서 다시 ctx에 loggedInUser라는곳 새로운곳에 저장함..
        //바로 loggedInUser를 쓰기위해..
        //최종결론..
        //ctx.connection.context.loggedInUser 를 여기서 만들고
        //ctx.connection.context.loggedInUser를 ctx.loggedInUser에 저장해
        // 아폴로 서버의 context에  ctx를 저장한다!
      };
    },
  },
});

const app = express();
app.use(graphqlUploadExpress());
//최신버전 업로드 진행

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

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);
// 웹소켓 설치.. 우리 서버에 웹소캣 정보를 준다!

// app.listen({ port: PORT }, () => {
httpServer.listen(PORT, () => {
  //httpServer상에서 listening중.. app이 아니라!
  //앱을 listen시키면 자동적으로 apolloServer가 같이 오게된다!
  console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
});
