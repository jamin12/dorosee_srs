# 사용법
## 개요
- 수정하고 싶은 모델을 소스코드에 작성해 수정할 수 있게 해준다
## 마이그레이션 파일 생성
- sequelize migration:create --name add // add라는 이름으로 파일이 생성된다.
- up 속성
  - migration을 통해 수정할 모델 작성하는 소스코드 로직
- down 속성
  - migration을 통해 되돌릴 때 수행되는 로직
``` js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Users',
        'Number',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
   return queryInterface.sequelize.transaction( transaction => {
     return Promise.all([
       queryInterface.removeColumn('Users', 'Number', {transaction: transaction})
     ])
   })
  }
};
```
addColumn으로 새로운 컬럼을 추가
removeColumn으로 해당 컬럼 삭제
## 마이그레이션 실행
- sequelize db:migrate --env development
## 마이그레이션 되돌리기
- sequelize db:migrate:undo --env development