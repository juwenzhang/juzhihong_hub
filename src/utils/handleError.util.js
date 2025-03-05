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

const app = require('../app/index.app')
const { UserErrorMessages } = require("../constant/app.constant")
const { MomentErrorMessages } = require("../constant/app.constant")

app.on("error", (err, ctx) => {
    let code = 0
    let message = ""
    let status = 200

    // check error
    switch (err) {
        case UserErrorMessages.NAME_OR_PASSWORD_IS_REQUIRED:
            code = -1001
            message = "用户名或密码不能为空"
            status = 400
            break
        case UserErrorMessages.USER_ALREADY_EXISTS:
            code = -1002
            message = "用户名已存在"
            status = 409
            break
        case UserErrorMessages.PASSWORD_LENGTH_IS_TOO_SHORT:
            code = -1003
            message = "密码长度不能小于6位"
            status = 400
            break
        case UserErrorMessages.PASSWORD_IS_NOT_STRONG:
            code = -1004
            message = "密码强度不够~~~"
            status = 400
            break
        case UserErrorMessages.USER_INFO_NOT_EXIST:
            code = -1005
            message = "用户不存在"
            status = 404
            break
        case UserErrorMessages.USER_PASSWORD_IS_INCORRECT:
            code = -1006
            message = "密码不正确"
            status = 401
            break
        case UserErrorMessages.TOKEN_GENERATE_FAILED:
            code = -1007
            message = "token生成失败"
            status = 500
            break
        case UserErrorMessages.TOKEN_IS_REQUIRED:
            code = -1008
            message = "token不能为空"
            status = 400
            break
        case UserErrorMessages.TOKEN_VERIFY_FAILED:
            code = -1009
            message = "token验证失败"
            status = 401
            break
        case UserErrorMessages.TOKEN_VERIFY_EXPIRED:
            code = -1010
            message = "token已过期"
            status = 401
            break
        case UserErrorMessages.REDIS_CONNECTION_FAILED:
            code = -1011
            message = "redis连接失败"
            status = 500
            break
        case UserErrorMessages.TOKEN_FORMAT_IS_INCORRECT:
            code = -1012
            message = "token格式不正确"
            status = 400
            break
        case MomentErrorMessages.MOMENT_USER_NOT_EXIST:
            code = -1013
            message = "用户不存在，无法发布评论"
            status = 404
            break
        default:
            break
    }

    ctx.status = status
    ctx.body = {
        code,
        message
    }
})