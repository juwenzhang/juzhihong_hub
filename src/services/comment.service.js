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

const connectionPool = require("../middlewares/mysql.middleware")

class CommentService {
    constructor() {
        this.__statement = {
            create_table: `
                CREATE TABLE IF NOT EXISTS comment(
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                    user_id BIGINT NOT NULL,
                    comment_id BIGINT NULL,
                    moment_id BIGINT NOT NULL,
                    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
                    FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE,
                    FOREIGN KEY(moment_id) REFERENCES moment(id) ON DELETE CASCADE
                );
            `,
            create_comment: `
                INSERT INTO comment(content, moment_id, user_id) VALUES(?, ?, ?);
            `,
            reply_comment: `
                INSERT INTO comment(content, moment_id, comment_id, user_id) VALUES(?, ?, ?, ?);
            `,
            delete_comment: `
                DELETE FROM comment WHERE id = ? AND user_id = ?;
            `,
        }
    }

    async createTable() {
        try {
            await connectionPool.execute(this.__statement.create_table)
        } catch (error) {
            console.log(error)
        }
    }

    async create_comment(content, moment_id, user_id, ctx) {
        try {
            const [res] = await connectionPool.execute(
                this.__statement.create_comment,
                [content, moment_id, user_id]
            )
            return res;
        } catch (error) {
            console.log(error)
            ctx.body = {
                code: 500,
                message: "服务器错误"
            };
        }
    }

    async getCommentMotionId(comment_id) {
        try {
            const [res] = await connectionPool.execute(
                `SELECT moment_id FROM comment WHERE id = ?;`,
                [comment_id]
            )
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    async reply_comment(content, moment_id, comment_id, user_id, ctx) {
        try {
            let _res = null;
            try {
                _res = await this.getCommentMotionId(comment_id);
            } catch (error) {
                ctx.body = {
                    code: 400,
                    message: "评论不存在"
                };
                return;
            }

            if (!_res || !_res.length) {
                ctx.body = {
                    code: 400,
                    message: "评论不存在"
                };
                return;
            }

            // console.log(Number(_res[0].moment_id) !== Number(moment_id))  // true
            if (Number(_res[0].moment_id) !== Number(moment_id)) {
                ctx.body = {
                    code: 400,
                    message: "评论不属于该动态"
                };
                return;
            }

            const [res] = await connectionPool.execute(
                this.__statement.reply_comment,
                [content, moment_id, comment_id, user_id]
            );
            return res;
        } catch (error) {
            ctx.body = {
                code: 500,
                message: "服务器错误"
            };
        }
    }

    async deleteComment(comment_id, user_id, ctx){
        try {
            await connectionPool.execute(
                this.__statement.delete_comment,
                [comment_id, user_id]
            )
        } catch (err) {
            console.log(err)
            ctx.body = {
                code: 500,
                message: "服务器错误"
            };
        }
    }
}

const commentService = new CommentService()
module.exports = commentService