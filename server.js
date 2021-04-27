require("dotenv").config();
// import dotenv from "dotenv"
// dotenv.config() require로 한줄을 만든것임!

import { ApolloServer } from "apollo-server";
import schema from "./schema";

const PORT = process.env.PORT;

//스키마 파일에서 typeDefs 와 리졸버,쿼리를 다햅해서 서버로 보내준다!
const server = new ApolloServer({
  schema,
});

server
  .listen(PORT)
  .then(() =>
    console.log(`🚀Server is running on http://localhost:${PORT} ✅`)
  );
