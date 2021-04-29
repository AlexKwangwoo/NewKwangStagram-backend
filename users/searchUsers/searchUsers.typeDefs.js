import { gql } from "apollo-server";

export default gql`
  type Query {
    searchUsers(keyword: String!): [User]
    # 키워드는 필요하되.. 유저배열이 있을수도 없을수도!
  }
`;
