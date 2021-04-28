0. 깃이닛후 리모트시킨뒤 npm init -y 로 프로젝트 만들기!

1. npm i apollo-server graphql

2. npm i nodemon --save-dev

3. npm i --save-dev @babel/core

4. npm install @babel/preset-env --save-dev
   (바벨은 최신자바스크립트 코드를 적었을때 브라우저가 이해할수있는 옛날코드로 전환함!
   코드를 변환해야할지 안해야할지 알아서 판단해줌! babel preset이 알아서 업데이트됨)
   (ex require 을 쓰는대신 import를 사용한다!)

5. npm install @babel/node --save-dev
   (npm run dev로 바벨을 실행하기위해.. 기본적으로 콘솔에서 js파일을 실행함!)
   ("dev": "nodemon --exec babel-node server"에서 nodemon은 babel-node를 통해 server.js 파일을 실행하는것임!)

6. npm install prisma -D, npx prisma init, 권한없다하면..
   npm cache clean --force!!
   (prisma는 orm으로 SQL을 자바스크립트 코드로 작성할수있게 도와줌!)
   (DATABASE_URL="postgresql://???:^^@localhost:5432/%%%?schema=public" 저기서 postgres를 포스트그래스 ??? 쓰는 owner이름 %%%은 디비이름, ^^ 비밀번호)
   (dev로 실행시켜줬기에 Client를 자동적으로 만들어줌)
   "prisma": "prisma" 를 package json에 써줘야 이전버전이랑 안겹쳐짐!
   !!!프리즈마는 default가 모든게 필수여서.. nullable할꺼면 ? 해줘야하고
   그래프큐엘은 모든게 선택사항이라 required를 적어줘야한다!! ! 느낌표를 이용해서

7. npx prisma migrate dev (shema.prisma가 바뀔떄마다 해줘야함!)
   (migration... 테스트 데이터베이스 사용할때 해야함!)

   -------여기까지 중요한건.. typeDefs의 테이블ex)movie와
   schema.prisma의 model movie을 같게만들어야함 또함..
   typeDefs을 쿼리와 뮤테이션을 리졸버와 동기화시켜야함!!
   그러면 migrate할때 알아서 CREATE TABLE해줌..

8. npx prisma studio

9. npm install graphql-tools, 권한없다고 뜨면 다시 껐다 켜보자!
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
