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

const userService = require("../services/user.service");
const { UserErrorMessages } = require("../constant/app.constant");
const strengthPwdUtil = require("../utils/strengthPwd.util");

const createTableMiddleware = async (ctx, next) => {
    // create table if not exists
    try{
        await userService.createTable()
        await next()
    } catch (error) {
        ctx.app.emit("error", UserErrorMessages.CREATE_USER_TABLE_ERROR, ctx)
    }
}

const userMiddlewareValidate = async (ctx, next) => {
    // body and query validate to get user info
    let user = ctx.request.query;
    if (!user.name || !user.password) {
        user = ctx.request.body;
    }
    // set user info to ctx
    ctx.userInfo = user
    await next()
}

const userInfoHasAllFieldsMiddleware = async (ctx, next) => {
    // validate user info
    const { name, password } = ctx.userInfo
    if (!name || !password) {
        ctx.app.emit("error", UserErrorMessages.NAME_OR_PASSWORD_IS_REQUIRED, ctx)
        return;
    }
    await next()
}

const userInfoHasExistedInDbMiddleware = async (ctx, next) => {
    // check user isExist
    const users = await userService.findByName(ctx.userInfo.name)
    if (users.length > 0) {
        ctx.app.emit("error", UserErrorMessages.USER_ALREADY_EXISTS, ctx)
        return;
    }
    await next()
}

const userPasswordHandleLengthMiddleware = async (ctx, next) => {
    const { password } = ctx.userInfo
    // validate password length
    if (password.length < 6) {
        ctx.app.emit("error", UserErrorMessages.PASSWORD_LENGTH_IS_TOO_SHORT, ctx)
        return;
    }
    await next()
}

const userPasswordHandleFormatMiddleware = async (ctx, next) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const { password } = ctx.userInfo
    // validate password strength
    if (!passwordRegex.test(password)) {
        ctx.app.emit("error", UserErrorMessages.PASSWORD_IS_NOT_STRONG, ctx)
        return;
    }
    await next()
}

const userPasswordHandleStrengthMiddleware = async (ctx, next) => {
    const { password } = ctx.userInfo
    // hash the password by bcryptjs
    ctx.userInfo.password = strengthPwdUtil(password)
    await next()
}

const userIsInDbMiddleware = async (ctx, next) => {
    // check user isExist
    const users = await userService.findByName(ctx.userInfo.name)
    if (users.length === 0) {
        ctx.app.emit("error", UserErrorMessages.USER_INFO_NOT_EXIST, ctx)
        return;
    }
    ctx.dbUser = users[0]  // user data from db
    await next()
}

module.exports = {
    createTableMiddleware,
    userMiddlewareValidate,
    userInfoHasAllFieldsMiddleware,
    userInfoHasExistedInDbMiddleware,
    userPasswordHandleLengthMiddleware,
    userPasswordHandleFormatMiddleware,
    userPasswordHandleStrengthMiddleware,
    userIsInDbMiddleware
}