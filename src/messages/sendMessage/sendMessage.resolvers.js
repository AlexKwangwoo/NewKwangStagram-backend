import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        //대화방이 있으면 넣어주고 null이면 만들어준다
        //유저아이디가 있다면 방이 없다는거고
        //방아이디가 있으면 유저아이디가 없고 이미 방이만들어져있음
        let room = null;
        if (userId) {
          //있는유저인지 확인
          const user = await client.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              id: true,
            },
          });
          if (!user) {
            return {
              ok: false,
              error: "This user does not exist.",
            };
          }
          room = await client.room.create({
            //유저가 있다면 방을 만든다.
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  {
                    id: loggedInUser.id,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });
          if (!room) {
            return {
              ok: false,
              error: "Room not found.",
            };
          }
        }
        const message = await client.message.create({
          data: {
            payload,
            room: {
              //보내는 방이 어딘지 연결
              connect: {
                id: room.id,
              },
            },
            user: {
              //보내는 사람이 누군지 연결.
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        //{{message:"hi"}}가 아니라 {message:hi}가 들어가야함
        //{ roomUpdates: { message }}이렇게하면 오브젝트속 오브젝트가 들어가버림
        // 여기서 실시간을 트리거 함.. 메시지 생성될때.. 리스닝하는친구에게 정보줌
        //그리고 중요!! 리턴type이 똑같아야함 roomUpdates.typeDefs에서 정의한것이랑!!!!
        return {
          id: message.id,
          ok: true,
        };
      }
    ),
  },
};
