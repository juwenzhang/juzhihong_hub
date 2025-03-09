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

const momentService = require('../services/moment.service');
const { MomentErrorMessage } = require('../constant/app.constant');

class MomentController {
    async create(ctx, next) {
        // get content from client-side
        const { content } = ctx.request.body;
        if (!content) {
            ctx.app.emit(
                'error', MomentErrorMessage.MomentErrorMessages.MOMENT_CONTENT_IS_REQUIRED,
                ctx
            )
        }
        // get user-info from verifyToken middleware, this is a userObject
        const { id, name } = ctx.user

        // save to db
        const res = await momentService.create(content, id, ctx);
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "发表动态成功",
            data: {
                id,
                name,
                content,
                ...res
            }
        }
    }

    async getCommentList(ctx, next){
        // realise offset and limit
        const { offset, size } = ctx.query
        const res = await momentService.getMomentList(offset, size)
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "获取动态列表成功",
            offset,
            size,
            total: res.length,
            data: {
                ...res
            }
        }
    }

    async getMomentById(ctx, next){
        // get id from params
        const { momentId } = ctx.params
        const res = await momentService.getMomentById(momentId)
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "获取动态成功",
            total: res.length,
            data: res
        }
    }

    async updateComment(ctx, next){
        const { momentId } = ctx.params
        const { content } = ctx.request.body
        if (!content) {
            ctx.app.emit(
                'error', MomentErrorMessage.MOMENT_CONTENT_IS_REQUIRED,
                ctx
            )
        }

        const res = await momentService.updateComment(momentId, content)
        if (res.length === 0) {
            ctx.app.emit(
                'error', MomentErrorMessage.MOMENT_NOT_EXIST,
                ctx
            )
        }
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "更新动态成功",
            data: {
                ...res
            }
        }
    }

    async deleteComment(ctx, next){
        const { momentId } = ctx.params
        const res = await momentService.deleteComment(momentId)
        if (res.length === 0) {
            ctx.app.emit(
                'error', MomentErrorMessage.MOMENT_NOT_EXIST,
                ctx
            )
        }
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "删除动态成功",
            data: {
                ...res
            }
        }
    }

    async addLabels(ctx, next){
        const { labelStatusSuccess, labelStatusFail, labelId } = ctx.labelStatus
        const { momentId } = ctx.params
        if (!momentId) {
            ctx.app.emit(
                'error', MomentErrorMessage.MOMENT_CONTENT_IS_REQUIRED,
                ctx
            )
            return
        }
        for (let id of labelId) {
            const isExist = await momentService.hasLabel(momentId, id)
            if (!isExist) {
                await momentService.addLabel(momentId, id)
            }
        }
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "添加标签成功",
            data: {
                momentId,
                add_label_success: [
                    ...labelStatusSuccess
                ],
                add_label_fail: [
                    ...labelStatusFail
                ]
            }
        }
    }
}

const momentController = new MomentController();
module.exports = momentController;