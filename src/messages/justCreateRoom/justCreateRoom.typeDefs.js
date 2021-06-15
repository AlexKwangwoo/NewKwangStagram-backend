import { gql } from "apollo-server";

export default gql`
  type justCreateRoomResult {
    ok: Boolean!
    talkingTo: User!
    id: Int!
    error: String
  }
  type Mutation {
    justCreateRoom(userId: Int): justCreateRoomResult!
  }
`;
