import { gql } from "apollo-server";

export default gql`
  type EditProfileResult {
    ok: Boolean!
    error: String
  }

  type Mutation {
    editProfile(
      firstName: String
      lastName: String
      username: String
      email: String
      password: String
      bio: String
      avatar: Upload # schema를 아폴로서버에서 지워주고 typeDefs와 resolver로 나눠서
    ): # 아폴로서버가 upload라는 친구를 사용할수있게 만들어줌!
    EditProfileResult!
  }
`;
