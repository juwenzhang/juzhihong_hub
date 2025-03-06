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

const CommentService = require('../services/comment.service');
const {CommentErrorMessage} = require("../constant/app.constant");

class CommentController {
    async create_comment(ctx, next){
        const { content, moment_id } = ctx.request.body;
        const user_id = ctx.user.id;
        const user_name = ctx.user.name;
        const res = await CommentService.create_comment(
            content, moment_id, user_id, ctx
        );
        if (res) {
            ctx.body = {
                code: 0,
                msg: 'success',
                status: 200,
                ok: true,
                desc: "评论创建成功",
                data: {
                    user_id,
                    user_name,
                    moment_id,
                    content,
                    ...res
                }
            }
        } else {
            ctx.app.emit("error", CommentErrorMessage.COMMENT_CREATE_ERROR, ctx)
        }
    }

    async reply_comment(ctx, next){
        const user_id = ctx.user.id;
        const user_name = ctx.user.name;
        const { content, comment_id, moment_id } = ctx.request.body;
        const res = await CommentService.reply_comment(
            content, moment_id, comment_id, user_id, ctx
        );
        if (res) {
            ctx.body = {
                code: 0,
                msg: 'success',
                status: 200,
                ok: true,
                desc: "回复评论成功",
                data: {
                    user_id,
                    user_name,
                    content,
                    comment_id,
                    moment_id,
                    ...res
                }
            }
        }
    }

    async delete_comment(ctx, next){
        const { commentId } = ctx.params;
        const user_id = ctx.user.id;
        await CommentService.deleteComment(
            commentId, user_id, ctx
        );
        ctx.body = {
            code: 0,
            msg: 'success',
            status: 200,
            ok: true,
            desc: "删除评论成功",
            data: {
                commentId
            }
        }
    }
}

const commentController = new CommentController();
module.exports = commentController;