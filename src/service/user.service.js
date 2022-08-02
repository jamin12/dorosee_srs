const { users, user_details, sequelize, Sequelize } = require("../models/index");
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const logger = require("../config/logger");
const CustomError = require("../util/Error/customError");
const httpStatus = require("http-status");
const pick = require("../util/pick");

const userJ = sequelize.define(
	"users",
	// { id: Sequelize.INTEGER },
	{ timestamps: false }
);

const userDetailJ = sequelize.define(
	"user_details",
	// { id: Sequelize.INTEGER },
	{ timestamps: false }
);

users.hasMany(userDetailJ);
userDetailJ.belongsTo(userJ);

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

	async isPasswordMatchByUsername(username, password) {
		const user = await users.findOne({
			where: {
				username: username,
			}
		});
		return bcrypt.compare(password, user.password);
	}

	// user 존재 유무 체크
	// user 이름 중복 유무
	// TODO: 수정(유저 이름 중복 잘못됨)
	async checkUserByUsername(username, compareUsername) {
		const user = await users.findOne({
			where: {
				username: username,
			}
		});
		if(!user){
			throw new CustomError(httpStatus.NOT_FOUND, "User not found.");
		}
		if (user.username === compareUsername) {
			throw new CustomError(httpStatus.BAD_REQUEST, 'username is already in use')
		}
		return user.id
	}

	async createUser(userInfo) {
		// 트랜젝션 처리
		await sequelize.transaction(async (t1) => {
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

	async updateUser({ username }, userInfo) {
		const userId = await this.checkUserByUsername(username, userInfo.username);
		const userbasic = pick(userInfo, ['username', 'password', 'role']);
		const userDetil = pick(userInfo, ['details']);
		await sequelize.transaction(async (t1) => {
			await users.update(
				userbasic,
				{
					where: {
						id: userId,
					}
				}
			);

			// user_detail 테이블에 데이터 삽입
			await user_details.update(
				userDetil ,
				{
					where: {
						username: userId,
					}
				}
			);
		}
		)
	}

}

module.exports = UserService;
