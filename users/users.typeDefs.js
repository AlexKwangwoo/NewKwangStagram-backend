import { gql } from "apollo-server";

export default gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    # password는 필요없다.. 그래프큐엘에서 패스워드를 볼일은 없기에..
  }

  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): User
  }

  type Query {
    seeProfile(username: String!): User
  }
`;
