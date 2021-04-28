import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
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
    //처음으로 4개의 인자를 받아서 이부분이 실행될것임!!
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "Please log in to perform this action.!!!",
      };
    }
    //로그인 되어있다면! 이제서야 월래 하려했던 함수를 인자를 다시
    // 넣고 실행시킬것임!
    return ourResolver(root, args, context, info);
  };
} //A함수를 받고 인자를 받을때 까지 기다린다.. 인자를 받으면 B함수를 실행시키고
//B의 함수 결과값으로 처음 인지 받은걸 A함수에 넣어서 리턴시킴!!
