import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    console.log("token", token);
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    console.log("user", user);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

//Curring 함수!
// 새로운 문법임.. x("a")("b")는 X에 a를 넣어 반환되는 값이 또다른 함수를
//불러 오고.. 리턴된함수("b")가 마지막에 실행될것임!!
//protectedResolver = (ourResolver) 가 x("a") 이고 ("b")가
//(root,args,context,info) 이다!
//ourResolver 는 graphql resolver를
//리턴할건데 그건 root, args, context, info를 받음

//protectResolver 를 부르면 리졸버가 된다! 그리고 유저가 로그인되어있는지 확인함
//이게 하고자 하는건 우리가 resolver를 직접만드는것임!

//------------------간단하게 말하자면!!!!!
// protectedResolver는 ourResolver를 실행할껀데 단!! 인자가 들어왔을때
// 조건문을 먼저!!!!!!!!!! 실행을하고 ourResolver를실행을 한다..
//즉 여기선 함수가 실행되기전 인자들을 가진후 조건을 실행한뒤 월래 하려했던
//리졸버를 실행한다 보면된다!!
export function protectedResolver(ourResolver) {
  //문법설명 protectedResolver(ourResolver(root,args,context,info))는
  //protectedResolver 가 ourResolver함수를 인자로 받고 그 인자들을 이용해
  // 마지막 => {내용} 내용을 실행시킬것임!
  return function (root, args, context, info) {
    //ourResolver는 위의4개의 인자가 들어있는 함수가올것임
    //처음으로 4개의 인자를 받아서 이부분이 실행될것임!!
    //info는 우리의 부모친구가 어떤 정보를 가졌는지 알수있음..

    if (!context.loggedInUser) {
      //로그인이 안되어있다면..
      //쿼리일때는 null만 리턴.
      //쿼리는 주로 우리가 보호를 하지 않아도 로그오프유저도 사용가능한데..
      //아무나 쓸수없는 쿼리를 봐줘야하기때문
      //예를 들면 seeFeed이다.. 얘는 로그인된애만 할수있기에..
      //뮤테이션이 아닌 쿼리여서.. 결과값이 User어레이가 된다..
      //그래서 로그인이 필요한 쿼리에서 -> 로그인 없을때 쿼리를 시키면
      //error ok 받게되는데 결과값은 user 배열로 받기로 했다..
      //그래서 null을 보내줘 결과값이 user어레이가 null로 나오게만 해주는것임!

      const query = info.operation.operation === "query";
      //이렇게 안하면 로그인 필요한 뮤테이션도 결과값을 error ok나오게하면됨
      //아무조록 info를 통해 쿼리인지 뮤테이션인지 알수잇음!
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    //로그인 되어있다면! 이제서야 월래 하려했던 함수를 인자를 다시
    // 넣고 실행시킬것임!
    return ourResolver(root, args, context, info);
  };
} //A함수를 받고 인자를 받을때 까지 기다린다.. 인자를 받으면 B함수를 실행시키고
//B의 함수 결과값으로 처음 인지 받은걸 A함수에 넣어서 리턴시킴!!
