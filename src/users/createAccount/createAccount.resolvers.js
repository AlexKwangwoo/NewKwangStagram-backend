import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        // check if username or email are already on DB.
        const existingUser = await client.user.findFirst({
          //먼저 존재하는 아이디 또는 이메일이 있는지 찾는다. 중복X
          //firstFind는 조건에 맞는 배열중 첫번째값만 리턴한다!
          where: {
            OR: [
              {
                username,
              },
              {
                email,
                // email:email,
              },
            ],
          },
        });
        // console.log(existingUser);
        if (existingUser) {
          throw new Error("This username/email is already taken.");
        }
        // hash password
        // save and return the user

        const uglyPassword = await bcrypt.hash(password, 10);
        //비밀번호를 몇번 hash? 10번!
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return {
          ok: true,
        };
        // 똑같음!!
        // const user = await client.user.create({
        //   data: {
        //     username,
        //     email,
        //     firstName,
        //     lastName,
        //     password: uglyPassword,
        //   },
        // });
        // return user;
      } catch (e) {
        return {
          ok: false,
          error: "Cant create account.",
        };
      }
    },
  },
};
