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

6. npm install prisma -D, npx prisma init, 권한없다하면..npm cache clean --force!!
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

11.
