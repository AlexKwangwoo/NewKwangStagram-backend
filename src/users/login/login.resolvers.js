import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      //먼저 유저가 있는지 확인한다
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found.",
        };
      }

      //유저가 있다면 해쉬된 패스워드를 확인한다!
      // 지금 입력받는 비번과 월래 유저가 가지고 있는 비번을 확인한다!
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "Incorrect password.",
        };
      }

      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      //sign첫번째 인자는 넣을 인자.. 두번쨰는 비밀번호 조합키!!
      //server.js에서 글로벌로 env쓸수있게 해줬음!!
      return {
        ok: true,
        token,
      };
    },
  },
};
