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

const connectionPool = require('../middlewares/mysql.middleware')
const {MomentErrorMessages, MomentErrorMessage} = require('../constant/app.constant')

class MomentService {
    constructor() {
        this.__statement = {
            create_table: `
                CREATE TABLE IF NOT EXISTS moment(
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                    user_id BIGINT NOT NULL,
                    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
                );
            `,
            insert: `
                INSERT INTO moment (content, user_id) VALUES(?, ?);
            `,
            // moment-table has many user-table, comment-table
            select_comment_list: `
                SELECT 
                JSON_OBJECT(
                    'user_id', user.id, 
                    'user_name', user.name, 
                    'user_create_time', user.create_time, 
                    'user_update_time', user.update_time
                ) AS user_info,
                JSON_OBJECT(
                    'moment_id', moment.id,
                    'moment_content', moment.content,
                    'moment_user_id', moment.user_id,
                    'moment_create_time', moment.create_time,
                    'moment_update_time', moment.update_time    
                ) AS moment_info,
                (SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id) AS comment_count
                FROM moment LEFT JOIN user 
                ON user.id = moment.user_id
                LIMIT ?, ?
            `,
            select_comment_list_by_id: `
                SELECT 
                JSON_OBJECT(
                    'user_name', user.name,
                    'user_create_time', user.create_time,
                    'user_update_time', user.update_time
                ) AS user_info,
                JSON_OBJECT(
                    'moment_id', moment.id,
                    'moment_content', moment.content,
                    'moment_user_id', moment.user_id,
                    'moment_create_time', moment.create_time,
                    'moment_update_time', moment.update_time    
                ) AS moment_info,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'comment_id', comment.id,
                        'comment_content', comment.content,
                        'comment_user_id', comment.user_id,
                        'comment_moment_id', comment.moment_id,
                        'comment_comment_id', comment.comment_id,
                        'comment_author_info', JSON_OBJECT(
                            'comment_author_id', comment_user.id,
                            'comment_author_name', comment_user.name,
                            'comment_author_create_time', comment_user.create_time,
                            'comment_author_update_time', comment_user.update_time
                        ),
                        'comment_create_time', comment.create_time,
                        'comment_update_time', comment.update_time
                    )
                ) AS comment_infos,
                (SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id) AS comment_count,
                (SELECT COUNT(*) FROM moment_label WHERE moment_label.moment_id = ?) AS label_count
                FROM moment 
                LEFT JOIN user ON user.id = moment.user_id 
                LEFT JOIN comment ON comment.moment_id = moment.id
                LEFT JOIN user AS comment_user ON comment_user.id = comment.user_id
                WHERE moment.id = ?
                GROUP BY moment.id;
            `,
            update_comment: `
                UPDATE moment SET content = ? WHERE id = ?;
            `,
            delete_comment: `
                DELETE FROM moment WHERE id = ?;
            `,
            get_user_id_by_id: `
                SELECT * FROM moment WHERE id = ?;
            `,
            select_label_is_exist: `
                SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;
            `,
            insert_label: `
                INSERT INTO moment_label (moment_id, label_id) VALUES(?, ?);
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

    async create(content, user_id, ctx) {
        try {
            const [res] = await connectionPool.execute(this.__statement.insert, [content, user_id])
            return res;
        } catch (error) {
            console.log(error)
            ctx.app.emit("error", MomentErrorMessages.MOMENT_USER_NOT_EXIST, ctx)
        }
    }

    async getMomentList(offset="0", size="10") {
        try {
            const [res] = await connectionPool.execute(this.__statement.select_comment_list, [offset, size])
            return res;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async getMomentById(id) {
        try {
            const [res] = await connectionPool.execute(this.__statement.select_comment_list_by_id, [id, id])
            return res;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async getUserIdById(id) {
        try {
            const [res] = await connectionPool.execute(this.__statement.get_user_id_by_id, [id])
            return res;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateComment(id, content) {
        try {
            const [res] = await connectionPool.execute(this.__statement.update_comment, [content, id])
            return res;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async deleteComment(id) {
        try {
            const [res] = await connectionPool.execute(this.__statement.delete_comment, [id])
            return res;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async hasLabel(moment_id, label_id, ctx){
        const [res] = await connectionPool.execute(
            this.__statement.select_label_is_exist,
            [moment_id, label_id]
        )
        return !!res.length;
    }

    async addLabel(moment_id, label_id, ctx){
        try {
            const [res] = await connectionPool.execute(
                this.__statement.insert_label,
                [moment_id, label_id]
            )
            return res;
        } catch (error) {
            console.log(error)
            ctx.body = {
                code: 500,
                message: "服务器错误"
            }
        }
    }
}

const momentService = new MomentService()
module.exports = momentService