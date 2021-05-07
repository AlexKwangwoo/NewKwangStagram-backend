import { gql } from "apollo-server";

export default gql`
  scalar Upload

  type MutationResponse {
    ok: Boolean!
    error: String
    id: Int
    # id는 필수가아님.. 코멘드 id얻기위해 만들었음! createCommend에서 추가해줄것임
  }
`;
