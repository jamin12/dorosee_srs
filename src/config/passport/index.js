const passport = require('passport');
const { localStrategy } = require('./localStrategy');
const logger = require('../logger');
const model = require('../../models/index');


// TODO: 회원 등록절차는 따로 만들어야함
module.exports = () => {
    // 세션에 저장 로그인이 최초로 성공했을 때만 호출되는 함수
    passport.serializeUser(async (id,done)=>{
        logger.info("id: " + id)
        await model.users.findOne({where :{id: id}})
        .then(async () => {
            done(null, id)
        })
        .catch((err) => {
            done(err, null)
        });
    });
    
    // 사용자가 페이지를 방문할 때마다 호추로디는 함수
    passport.deserializeUser((id,done)=>{
        done(null, id);
    });

    passport.use('local', localStrategy);
};