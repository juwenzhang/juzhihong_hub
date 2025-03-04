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
const {UserErrorMessages} = require("../constant/app.constant");

class UserController {
    async create(ctx, next) {
        // get user info from ctx middleware
        const user = ctx.userInfo;
        // create user, save to db
        const res = await userService.create(user)
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
        console.log(userInfo, dbUser)
        if (matchPwdUtil(userInfo.password, dbUser.password)) {
            ctx.body = {
                code: 0,
                msg: 'success',
                status: 200,
                ok: matchPwdUtil(userInfo.password, dbUser.password),
                desc: "用户登录成功",
                data: {
                    token: 'token'
                }
            }
        } else {
            ctx.app.emit("error", UserErrorMessages.USER_PASSWORD_IS_INCORRECT, ctx)
        }
    }
}

const userController = new UserController();
module.exports = userController;