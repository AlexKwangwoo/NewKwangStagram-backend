import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { withFilter } from "apollo-server";
import client from "../../client";

export default {
  Subscription: {
    roomUpdates: {
      // 밑에껀 private이고,,, public 하고싶으면
      // subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),//식으로하면됨
      subscribe: async (root, args, context, info) => {
        // console.log("context", context);
        //1. 룸이 없을때 에러뜨게 하고싶은데 리턴값이 정해진 룰에 따라
        //리턴을 해야함을 알게됨.. 그래서 (root, args, context, info)
        //써주고 마지막부분에서 (root, args, context, info) 써줌..
        //protected resovler랑 비슷함.. 이렇게 안해주면 우리는 에러뜰껏임
        console.log("room확인", room);
        console.log("args.id", args.id);
        console.log("context.loggedInUser.id", context.loggedInUser.id);
        console.log("context.loggedInUser.id", context.loggedInUser.username);
        const room = await client.room.findFirst({
          // const room = await client.room.findUnique({
          //위에처럼 못함..user는 유니크가 아니기에
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (!room) {
          throw new Error("You can not see this.");
          //방이없을때
          // 절대로 null 리턴하면안됨.. 그래서 에러를 던져야함
        }
        return withFilter(
          //withFilter 두개의 인자를 가지는데 하나는.. 언제 발동될껀지에대한 조건.
          //두번째는 발동되는데 더 정확한 필터를 거친후 발동되는 조건 무조껀
          //false or true를 리턴해야함.. 트루여야 업데이트됨
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            if (roomUpdates.roomId === id) {
              //업데이트 할려는 방이맞다면
              //여기서 첫번째인자 roomUpdates는
              // pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
              // 여기서의 roomUpdates 이고
              //두번째 인자 id는 유저가 나중에 프론트엔드에서 보낼 방 id이다
              //ex) subscription{
              //   roomUpdates(id:1){
              //     payload
              //   }
              // }
              //roomUpdates.roomId  는
              // sendMessage의
              // pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
              //저기서 오는것임 잊으면 안됨
              const room = await client.room.findFirst({
                //지금 체팅방을 찾고
                //- 위에서 했는데 한번더 찾는 이유는 위의 룸은 리스닝 전이고
                //여기는 리스닝 하고있을때 작동한다.. 만약 리스닝 하고있는
                //도중에 나가게된다면.. 여기가 없으면 계속 업데이트될것임
                where: {
                  id,
                  users: {
                    some: {
                      id: loggedInUser.id,
                      //로그인유저가 그 체팅방에 속해있으면 트루
                      //없으면 false최종적으로 리턴
                    },
                  },
                },
                select: {
                  id: true,
                },
              });
              if (!room) {
                return false;
              }
              return true;
            }
            // ({ roomUpdates }, { id }) => {
            //여기서 첫번째인자 roomUpdates는
            // pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
            // 여기서의 roomUpdates 이고
            //두번째 인자 id는 유저가 나중에 프론트엔드에서 보낼 방 id이다
            //ex) subscription{
            //   roomUpdates(id:1){
            //     payload
            //   }
            // }

            //우리가 보는방이 업데이트 되어야 하기에
            //즉우리가 지금 아이디5번방을 보고있는데 1번방이 업데이트된다고하면
            //우린 볼수없다..
          }
        )(root, args, context, info);
        //protected resovler랑 비슷함.. 이렇게 안해주면 우리는 에러뜰껏임
      },
      //NEW_MESSAGE 를 리스닝 하는것임
      //어디선가 pubsub.publish(NEW_MESSAGE,{업데이트내용})
      //하는순간 여기가 작동할것임!
    },
  },
};
