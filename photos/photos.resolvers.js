import client from "../client";

export default {
  //여기서는 무조껀 parent(root)를 불러와야한다.. 그럼 포토 업로드할때
  // 업로드된 포토 내용이 root가 될것이고 그포토는 userId라던지 포토ID등을
  //가지고 있을것이다!
  Photo: {
    //그래프 큐엘에서 업로드 포토할때 user와 hashtags볼려해도 여기서 작성안해주면
    //볼수가 없다.. 이유는 readme39~40번 보면됨.
    //간단하게말하면 Photo테이블(pgAdmin4) 에 없는 user와hashtag는 따로 다른데
    //저장되어있는데 이를 볼려면 여기서 정의를 해주거나 내가 쓸려는
    //뮤테이션 쿼리에 include로 다른테이블 친구들 본다고 정의를 해줘야함! 단
    //서로 photo <-> user, photo <-> hashtag 처럼 서로 연결되어있어야함!
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    //여기서 id는 photoID이고 userid는 포토주인의 아이디이다
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    comments: ({ id }) => client.comment.count({ where: { photoId: id } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },

  Hashtag: {
    //헤시태그 관련 해서 사진을 찾았는데 food관련 사진이 만장이라면?
    //그래서 포토 자체에서 페이지를 나눠서 주면된다!
    photos: ({ id }, { page }, { loggedInUser }) => {
      console.log(page);
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos();
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};
