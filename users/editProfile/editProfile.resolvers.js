import { createWriteStream } from "fs";
//fs는 file system임!!
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

console.log(process.cwd());

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) =>
  //값을 안적어주면 undefined가 들어가게되는데 undefined로 업데이트되면?
  // prisma는 아주 똑똑해서 값이 undefined로 보낼경우 데이터베이스로 보내지않음..
  // ex) 프로필 수정시.. 비번만 고친다면 나머지는 undefined로
  // 갈텐데 프리즈마가 비번만 디비로 업데이트 시킴!!
  {
    //loggedInUser 토큰을 분석해 findUniqe통해 유저를 반환할것임!

    // const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    //우리사이트 암호로 만들었던 토큰을 재해석해 토큰 정보를 가져온다

    let avatarUrl = null;
    if (avatar) {
      const { filename, createReadStream } = await avatar;
      const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
      // 파일 이름이 같을수있으니 중복방지를 위해 이름을 유니크하게 해주자

      const readStream = createReadStream();
      //createReadStream은 nodejs에서 온 함수임!
      //파일 받으면 저절로 안에 포함됨.
      //이 함수로 파일을 읽을수있음!
      // const stream = createReadStream();
      // console.log(avatar);
      // console.log(stream);

      const writeStream = createWriteStream(
        //경로를 알려줘서 uploads폴더에 저장하고싶다..aws쓰기전에..
        // process.cwd() 이건.. 현재 이파일이 있는 경로를 알려준다!
        //ex)C:\Users\818396\Desktop\my_project\Nproject\NewKwangStagram
        //즉 절대 경로로 써줘야한다. filename은 내가 저장한 파일 이름
        process.cwd() + "/uploads/" + newFilename
      );
      readStream.pipe(writeStream);
      avatarUrl = `http://localhost:4000/static/${newFilename}`;
    }

    //읽어온 파일을 파이프(그대로 write로 보내줌)를 써서 write를 통해 저장함
    //그냥 이건 공식임..

    let uglyPassword = null;
    if (newPassword) {
      uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        firstName,
        lastName,
        username,
        email,
        bio,
        ...(uglyPassword && { password: uglyPassword }),
        //바꿀려는 비번이 있을시에.. 넣겠음!
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });
    if (updatedUser.id) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        error: "Could not update profile.",
      };
    }
  };

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
