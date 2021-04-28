import { gql } from "apollo-server";

export default gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    avatar: String
    createdAt: String!
    updatedAt: String!
    # password는 필요없다.. 그래프큐엘에서 패스워드를 볼일은 없기에..
  }
`;
