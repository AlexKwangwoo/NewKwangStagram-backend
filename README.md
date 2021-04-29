0.  깃이닛후 리모트시킨뒤 npm init -y 로 프로젝트 만들기!

1.  npm i apollo-server graphql

2.  npm i nodemon --save-dev

3.  npm i --save-dev @babel/core

4.  npm install @babel/preset-env --save-dev
    (바벨은 최신자바스크립트 코드를 적었을때 브라우저가 이해할수있는 옛날코드로 전환함!
    코드를 변환해야할지 안해야할지 알아서 판단해줌! babel preset이 알아서 업데이트됨)
    (ex require 을 쓰는대신 import를 사용한다!)

5.  npm install @babel/node --save-dev
    (npm run dev로 바벨을 실행하기위해.. 기본적으로 콘솔에서 js파일을 실행함!)
    ("dev": "nodemon --exec babel-node server"에서 nodemon은 babel-node를 통해 server.js 파일을 실행하는것임!)

6.  npm install prisma -D, npx prisma init, 권한없다하면..
    npm cache clean --force!!
    (prisma는 orm으로 SQL을 자바스크립트 코드로 작성할수있게 도와줌!)
    (DATABASE_URL="postgresql://???:^^@localhost:5432/%%%?schema=public" 저기서 postgres를 포스트그래스 ??? 쓰는 owner이름 %%%은 디비이름, ^^ 비밀번호)
    (dev로 실행시켜줬기에 Client를 자동적으로 만들어줌)
    "prisma": "prisma" 를 package json에 써줘야 이전버전이랑 안겹쳐짐!
    !!!프리즈마는 default가 모든게 필수여서.. nullable할꺼면 ? 해줘야하고
    그래프큐엘은 모든게 선택사항이라 required를 적어줘야한다!! ! 느낌표를 이용해서

7.  npx prisma migrate dev (shema.prisma가 바뀔떄마다 해줘야함!)
    (migration... 테스트 데이터베이스 사용할때 해야함!)

    -------여기까지 중요한건.. typeDefs의 테이블ex)movie와
    schema.prisma의 model movie을 같게만들어야함 또함..
    typeDefs을 쿼리와 뮤테이션을 리졸버와 동기화시켜야함!!
    그러면 migrate할때 알아서 CREATE TABLE해줌..

8.  npx prisma studio

9.  npm install graphql-tools, 권한없다고 뜨면 다시 껐다 켜보자!
    graphql-tools는 스키마파일에서 각자 원하는 파일을 모아 정리해 추가해준다!
    graphql-tool을 이용해
    스키마 파일에서 typeDefs 와 리졸버,쿼리를 다햅해서 서버로 보내준다!

10. npm i dotenv
    가상환경을 설정해야함. 가상환경의 우리의 환경변수를 읽을 수 있도록 하기위해서..
    dotenv를 app의 모든것의 맨위에서 즉시 실행시켜야함! <- 그의미는 server.js에서
    실행을 시켜야한다! //dotenv를 가져와서 실행 시켜줘야함!
    require("dotenv").config();
    // import dotenv from "dotenv"
    // dotenv.config() require로 한줄을 만든것임! <-이부분임
    어디서든 사용가능함!

11. npm i bcrypt
    비밀번호 hashing 해주기위해!!

12. findUnique 는 unique한 조건에서만 찾아줌..Firstname으로는 못찾음!!

13. npm install jsonwebtoken
    (토큰사용을 위해..) 토큰에 많은 정보를 실어 나갈수있음..! 역으로 해석해
    정보를 가져올수있음! 여기서 토큰만들떄와 재해석 할떄는 항상 우리가 만든
    시크릿키를 사용해야함!

14. js:785
    for (const type of types) {
    TypeError: types is not iterable 에러는 뮤테이션이나 typeDefs나 queries가 비어있으면 나오게되는 에러임!!

15. prisma는 아주 똑똑해서 값이 undefined로 보낼경우 데이터베이스로 보내지않음..
    ex) 프로필 수정시.. 비번만 고친다면 나머지는 undefined로 갈텐데 프리즈마가 비번만 디비로 업데이트 시킴!!

16. typeDefs의 mutation의 인자값이 resolver의 인자값으로 받을수있음
    ex)
    type Mutation {
    editProfile(
    firstName: String
    lastName: String
    username: String
    email: String
    password: String
    ): EditProfileResult!
    }

    ***

    저 값들이 밑으로 들어간다!!
    Mutation: {
    editProfile: async (
    \_,
    { firstName, lastName, username, email, password: newPassword }
    )

17. 중요!! 그래프 큐엘의 뮤테이션, 쿼리 형식을보면
    ex)
    Mutation: {
    editProfile: async (
    \_,
    { firstName, lastName, username, email, password: newPassword },
    context,
    info
    )
    인데.. 우리가 header에 토큰을 포함한뒤 => 아폴로 context에 포함시켜.. 전역에서 뮤테이션이나 쿼리를 사용할때 3번째 인자(context를 위한)를 뽑아서 사용하면된다! 이 컨택스트는
    server.js의 apollo server의 context에서 관리 되며 함수형식또는 오브젝트 형식이 될수있다!

18. user utils 에 있음!
    새로운 문법임.. x("a")("b")는 X에 a를 넣어 반환되는 값이 또다른 함수를
    불러 오고.. 리턴된함수("b")가 마지막에 실행될것임!!
    ------------------간단하게 말하자면!!!!!
    protectedResolver는 ourResolver를 실행할껀데 단!! 인자가 들어왔을때
    조건문을 먼저!!! 실행을하고 ourResolver를실행을 한다..
    즉 여기선 함수가 실행되기전 인자들을 가진후 조건을 실행한뒤 월래 하려했던
    리졸버를 실행한다 보면된다!!

19. graphql을 이용해 upload하고싶다면 (아폴로에도 file upload가 생겼음!)
    아폴로 서버를 이용한 업로드를 사용하고 싶다면 아폴로 서버가 스키마 생성을 할수
    있도록 해야한다!! 왜냐하면 아폴로 서버가 스키마를 자동생성 할수 있다면
    Upload type을 활성화 시켜줌!\
    ----> 그러기 위해서 typeDefs + resolver를 합친 schema를 apolloServer에
    줬었는데.. 그걸 schema를 없에고 typeDefs, resolver 적어준다!
    그러므로 playground의 schema가면 scalar Upload를 볼수있다!

20. playgrond는 파일 업로드가 불가능하기에 altair라는걸 사용할것임!
    (https://altair.sirmuel.design/)

21. 간혹 파일저장할때 nodemon이 새로 서버를 시작하려하는데 이전 process가 아직 안죽
    으면 app crashed 가 발생가능.. 그래서 package json에 dev에 delay를 준다!

22. 만약 createReadStream() console.log해서 오류나면(maximum call stack~~)
    "resolutions": {
    "fs-capacitor": "^6.2.0",
    "graphql-upload": "^11.0.0"
    } <---이걸 package json에 붙여주자!!
    그다음 node_module을 지우고
    그리고 "preinstall": "npx npm-force-resolutions", script에 써주고
    npm i 해줘야함! //버전이 달라서 그랬음..

23. 로컬에 저장한 사진은 서버가 uploads파일을 모른다
    ex) localhost:4000/uploads/사진이름 하면 찾을줄모름!!
    즉 아폴로 서버가 uploads폴더를 읽고 유저에게 보여주라고 설정 못함
    그래서 apollo-server-express를 사용해야함
    그래서 server.js를 바꿔줘야함. 그리고 그래프큐엘url에만 아폴로서버를
    생성할것임! aws사용할때 이런거 할필요없음 그러나 서버로 뭘하고싶은데
    아폴로 서버가 제한적일 수 있기에.. 해결방법을 생각해보는게 좋음
    즉 우리가 여태껏한건.. 아폴로 서버안에서 서버가 있어 우리가 바꿀수없는게있음
    하지만 그래프큐엘만 아폴로 서버 사용하고.. 다른건 베이직으로는
    express서버를 사용해보자
    express위에 apollo-server-express가 있기에..
    express 기준으로 사용하면서(많은걸 하기 위해ex)uploads폴더 바라보기)
    apollo-server-express를 그래프큐엘로만 줘서 사용가능하게하자

24. npm i express apollo-server-express express와 아폴로서버익스프레스 설치

25. npm i morgan
    express server를 노출시켜 놓은덕에 이제 middleware를 추가할수있음
    우리 서버에 들어오는 모든 요청들을 볼 수 있음

26. follower나 following이나 둘중하나만 업데이트해도 다른쪽이 업데이트됨

27. one to many 관계에서.. 내가 볼려는 구간에서 조건이 다맞으면 every
    그중 몇개면 some, 아무것도 일치하는게 없어야하면 none이다
    예를들어 client.user.count(where {following:{some or every or none : username}})일때 some이면 한 user의 팔로잉하는 사람중 1명이상이 username이면 가져온다.. none일때는 아무도 없어야 가져오고 every는 모든following이 username이여야 가져온다

28. cursor 페이지와 offset페이지가 있는데.. offset은 우리가 size를 정해
    페이지를 나눠서 가져오는데.. cursor은 가져온곳의 마지막 위치를 알려준다
    예를들어 1,2,3,4,5,6,7 인데 size가 4고.. 그럼 일단은 4까지 데이터를 받고
    cursor은 4에 위치한다 그리고 4다음꺼부터 보여주면되는데 skip을 1을 해서 4는제외하고 5부터 보여주는것임! 단점은 10페이지를 바로못감..
    페이지가1~50페이지면.. 순차적으로 스크롤 내려야함!

29. typeDefs의 User에도 resolver를 만들어줄수있음.. 각각의 필드들에 대해
    일정한 로직을 거치게 만들수있음.. 즉 password, lastname이 리졸버를 통해
    만들어 질수도 있다는것임.. isMe를 참고해보시길..

30. seeProfile의 경우 데이터베이스에 user를 찾는데 데이터베이스 user속에 없는
    필드값이 있는경우... ex totalfollower의 경우
    리졸버를 찾아다니고 totalfollower의 의 리졸버를 찾을경우 값을 반환하는데 문제는 root.. 우리가 seeProfile에서 리턴했던 User값을 사용할수있따
    단!! 반환값이 seeProfile처럼 User여야만 한다..

31. 팔로우 관련해서 find로 찾지않고 count로 하는이유는
    사람수가 많아지면 그사람들 내용을 다 load해야하기 떄문이다.. 하지만 count는
    그냥 수만 살려줌.

32. isFollowing 에서 const로 변수명을 안만들어주면 await안써도 알아서 해줄텐데..
    const 변수명 해주는바람에 await + async 까지 써줘야함

33. 에로우함수에서.. 보통 const a = () => {~~~ return ~~ } 이런식으로 온다하면
    {}안의 내용이 하나의 구문일떄는 => => { const b = 1+1; return b }
    이렇게 말고 const a = () => b = 1+1 이렇게 할수도 있다.. ex)SearchUsers

34. many to many 관계에서는 db에 저장되는게 아니라 걔네들끼리 다른 테이블을
    자동적으로 db 테이블을 만들어 관리함 예를들어 나는 많은 사람을 팔로우할수있고
    많은 사람들 또한 나를 팔로우 할수있다.. 그러면 user테이블에서 followers 에
    그 모든 사람들이 실제로 저장되는게 아니다. 따로 관계 테이블이 만들어진다
    예를들어 followRelation테이블이 만들어져.. id:4번은 id:5번을 팔로우 한다 이런식으로..

35. 정규식 caption.match(/#[\w]+/g); 이렇게하면 캡션에 있는 문장중 #+단어 만  
    뽑아낸다

36. 배열로 connectOrCreate에 넣어줄수있음 한 캡션에 여러 해쉬태그들이 있는데
    배열안에 다 모아서(where 과 create를 포함한..) 한번에 처리할수있음

37. return 다음에 뭐가 오면 await안해줘도 됨!

38. 속성 넣을때 조건문을 사용할때.. 예를들어 해쉬가 있을때랑 없을때 사진 업로드시
    ...(hashtagObj.length > 0 && {
    hashtags: {
    connectOrCreate: hashtagObj,
    //배열로 connectOrCreate에 넣어줄수있음
    },
    }), 와 같은부분에서!! ...은 뒤의 {} 벗겨주기 위해 있는것!
    ...(조건 && {조건만족시 실행할식}) 일때
    조건이 맞으면 ...{조건만족시 실행할식} 이게 되고 ...{} 이 상쇄되어
    조건만족시 실행할식 만 남게 된다!

39. photo upload후 플레이그라운드에서 user내용 볼려니 null이라 나온다 왜?
    즉, '항상' hashtags와 user의 전체 데이터가 필요하다면
    include를 사용하면 좋을 수 있을거에요.
    하지만, 그저 include: { hashtags: true, user:true } 로 설정을 해 두면
    hashtags나 user를 호출하든 호출하지 않던 데이터를 일단 가져 옵니다.
    반면에, user와 hashtags를 include하지 않고 resolver로 만들어둔다면
    프론트엔드에서 user와 hashtags를 달라고 요청할 때에
    resolver가 user와 hashtags를 resolver에 찾아 들어가서 데이터를 구해오고
    반환 합니다.

    즉 createPhoto에서
    // include: {
    // user: true,
    // hashtags:true,
    // },<-- photo 리졸버에 user, hastage 안만들고 이렇게도 가능!

40. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!중요!!!!!!!!!!!!!!!!!!!!!!!!!
    type에서 테이블에 저장되어있지 않는 정보를 달라고 할떄는 include해주거나
    resolver 39번 처럼 해줘야 한다.. 예를들어 following에는 pgadmin4 user테이블 보면
    없다!! 그래서 그래프큐엘에서 seeProfile에서 following 하면 나오질 않는다..그래서
    user.resolver에서 followers 와 following을 넣어주거나 seeProfile에서 include를 실행 해줘야 그래프큐엘에서 followers와 following 값을 받을수있다!

41.
