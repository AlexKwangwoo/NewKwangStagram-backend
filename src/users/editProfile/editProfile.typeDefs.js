import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editProfile(
      firstName: String
      lastName: String
      username: String
      email: String
      password: String
      bio: String
      avatar: Upload # schema를 아폴로서버에서 지워주고 typeDefs와 resolver로 나눠서
    ): # User avatar는  URL저장값이기에 string으로 받지만
    # 아폴로서버가 upload라는 친구를 사용할수있게 만들어줌!
    # 여기서 받는 타입은 업로드 파일 형식을 받게된다
    MutationResponse!
  }
`;
