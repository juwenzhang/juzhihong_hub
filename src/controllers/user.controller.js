/**
 * MIT License
 *
 * Copyright (c) 2025 ZhiHong Ju
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const userService = require('../services/user.service');
const matchPwdUtil = require('../utils/matchPwd.util');
const redisConnection = require('../middlewares/redis.middlwware')
const { UserErrorMessages } = require("../constant/app.constant");
const { storeToken } = require("../utils/token.util")
const {getAvatarByUserID} = require("../services/file.service");
const {createReadStream} = require("node:fs");
const { UPLOAD_AVATAR_PATH } = require("../config/path.config")

class UserController {
    async create(ctx, next) {
        // get user info from ctx middleware
        const user = ctx.userInfo;
        // create user, save to db
        const res = await userService.create(user, ctx)
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "用户创建成功",
            data: res
        }
    }

    async login(ctx, next){
        // get user info from ctx middleware, this data from client-side-request
        const userInfo = ctx.userInfo
        const dbUser = ctx.dbUser
        // console.log(userInfo, dbUser)
        const isMatch = matchPwdUtil(userInfo.password, dbUser.password)
        if (isMatch) {
            const payload = {
                id: dbUser.id,
                name: dbUser.name,
            }
            const redis_connection = redisConnection()
            let token = await redis_connection.get(`${payload.name}_${payload.id}_token`)
            if (!token) {
                token = await storeToken(
                    payload,
                    ctx
                )
                await redis_connection.set(
                    `${payload.name}_${payload.id}_token`,
                    token,
                    'EX',
                    60 * 60 * 24 * 14
                )
                ctx.body = {
                    code: 0,
                    msg: 'success',
                    status: 200,
                    ok: isMatch,
                    desc: "用户登录成功",
                    data: {
                        ...payload,
                        token
                    }
                }
            } else {
                ctx.body = {
                    code: 0,
                    msg: 'success',
                    status: 200,
                    ok: isMatch,
                    desc: "欢迎回来😊😊~~~",
                    data: {
                        ...payload,
                        token
                    }
                }
            }
        } else {
            ctx.app.emit("error", UserErrorMessages.USER_PASSWORD_IS_INCORRECT, ctx)
        }
    }

    async getAvatarByUserID(ctx, next){
        const { userId } = ctx.params
        const avatarInfo = await getAvatarByUserID(userId, ctx)
        const {
            filename,
            mimetype
        } = avatarInfo
        ctx.type = mimetype
        ctx.body = createReadStream(`${UPLOAD_AVATAR_PATH}/${filename}`)
    }
}

const userController = new UserController();
module.exports = userController;