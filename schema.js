import { loadFilesSync, mergeResolvers, mergeTypeDefs } from "graphql-tools";

//--중요!!-- loadFilesSync 친구를 쓸때 파일의 default export만 가져온다!!
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
// __dirname 안의 모든폴더(**) 어떠한이름(상관없음)(*)을 typeDefs.js 확장자만 가져온다!
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

//관련 파일들끼리만 모아서 schema에 전해준다!! 몇천장이여도 상관없다!
export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);
