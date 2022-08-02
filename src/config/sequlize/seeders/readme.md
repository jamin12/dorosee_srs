# 사용법
- sequelize init:seeders // seeders 폴더 생성
- sequelize seed:generate --name Test // seeders 폴더 안에 새로운 Test.js 파일 생성
- up 속성
  - seeders를 통해 생성할 데이터 만드는 소스코드 로직
- down 속성
  - seeders를 되돌릴 때 수행되는 로직
``` js
const { uuid } = require('uuidv4');

const userId1 = uuid();
const userId2 = uuid();
const userId3 = uuid();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    //유저 생성
    await queryInterface.bulkInsert('Users',[
      {
        id: userId1,
        email: "ryan@gmail.com",
        password: "123456",
        name: "Ryan1",
        phone: "010-0000-0000",
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        id: userId2,
        email: "ryan@gmail.com",
        password: "123456",
        name: "Ryan2",
        phone: "010-0000-0000",
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        id: userId3,
        email: "ryan@gmail.com",
        password: "123456",
        name: "Ryan3",
        phone: "010-0000-0000",
        createdAt: new Date,
        updatedAt: new Date
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    //유저 데이터 삭제
    return queryInterface.bulkDelete('Users', null, {});
  }
};
```
## seeders 실행
- sequelize db:seed:all

## seeders 되돌리기
- sequelize db:seed:undo:all //모든 Seed를 되돌린다.
- sequelize db:seed:undo // 가장 최근 Seed를 되돌린다.
- sequelize db:seed:undo --seed name-of-seed-as-in-data 특정 Seed를 되돌린다.