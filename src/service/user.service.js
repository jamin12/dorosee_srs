const { users, user_details, sequelize } = require("../models/index");
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const logger = require("../config/logger");
const CustomError = require("../util/Error/customError");
const httpStatus = require("http-status");
const pick = require("../util/pick");

class UserService {
	constructor() {
	}

	async getUserinfo(username) {
		//TODO: join query 만들기
		const query = `
		SELECT *
		FROM users
		LEFT OUTER JOIN user_details ON users.id = user_details.id
		WHERE username = '${username}'
		`;
		const [result, metadata] = await sequelize.query(query);
		return result;
	}

	async getUsersinfo() {
		//TODO: join query 만들기
		const query = `
		SELECT *
		FROM users
		LEFT OUTER JOIN user_details ON users.id = user_details.id
		`;
		const [result, metadata] = await sequelize.query(query);
		return result;
	}

	async isPasswordMatchByUsername(username, password) {
		const user = await users.findOne({
			where: {
				username: username,
			}
		});
		return bcrypt.compare(password, user.password);
	}
	
	// user 존재 유무 체크
	async checkExistUserByusername(username) {
		const user = await users.findOne({
			where: {
				username: username,
			}
		});
		if(!user) throw new CustomError(httpStatus.BAD_REQUEST, 'User does not exists');
		return user.id
	}

	// username 중복체크
	async checkUserByUsername(compareUsername) {
		const user = await users.findAll();
		if(!user.every(i => i.username !== compareUsername)){
			throw new CustomError(httpStatus.BAD_REQUEST, 'Username does exists');
		}
	}

	async createUser(userInfo) {
		// 트랜젝션 처리
		sequelize.transaction(async (t1) => {
			const id = uuid();
			// user 테이블에 데이터 삽입
			await users.create({
				id: id,
				username: userInfo.username,
				password: await bcrypt.hash(userInfo.password, 8),
				role: "user",
			});

			// user_detail 테이블에 데이터 삽입
			await user_details.create({
				id: id,
				name: userInfo.details.name,
				mobile: userInfo.details.mobile,
				memo: userInfo.details.memo,
			});
		});
	}

	async updateUser(username, userInfo) {
		await this.checkUserByUsername(userInfo.username);
		const userId = await this.checkExistUserByusername(username);
		const userbasic = pick(userInfo, ['username', 'password', 'role']);
		const userDetil = pick(userInfo, ['details']);
		sequelize.transaction(async (t1) => {
			// user_detail 테이블에 데이터 삽입
			await user_details.update(
				userDetil ,
				{
					where: {
						username: userId,
					}
				}
			);

			await users.update(
				userbasic,
				{
					where: {
						id: userId,
					}
				}
			);
		}
		)
	}

	async deleteUser(username){
		const user_id = await this.checkExistUserByusername(username);
		sequelize.transaction(async (t1) => {
			await user_details.destroy({
				where: {
					id: user_id
				}
			});
	
			await users.destroy({
				where: {
					id: user_id
				}
			});
		})


	}

}

module.exports = UserService;
