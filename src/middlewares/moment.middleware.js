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
const momentService = require("../services/moment.service");
const { MomentErrorMessage } = require("../constant/app.constant");

const verifyMomentPermissionMiddleware = async (ctx, next) => {
    const userId = ctx.user.id
    const { momentId } = ctx.params
    const res = await momentService.getUserIdById(momentId)
    if (res.length !== 0) {
        if (Number(res[0]?.user_id) !== Number(userId)) {
            ctx.app.emit("error", MomentErrorMessage.MOMENT_USER_NOT_PERMISSION, ctx)
            return
        }
        await next()
    } else {
        ctx.app.emit("error", MomentErrorMessage.MOMENT_NOT_EXIST, ctx)
    }
}

const createTableMiddleware = async (ctx, next) => {
    try {
        const res = await momentService.createTable()
        await next()
    } catch (error) {
        ctx.app.emit("error", MomentErrorMessage.CREATE_MOMENT_TABLE_ERROR, ctx)
    }
}

module.exports = {
    verifyMomentPermissionMiddleware,
    createTableMiddleware
}