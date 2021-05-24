import { gql } from "apollo-server";

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    photos: [Photo]
    avatar: String
    following: [User]
    followers: [User]
    createdAt: String!
    updatedAt: String!
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!

    # password는 필요없다.. 그래프큐엘에서 패스워드를 볼일은 없기에..
  }
`;
