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
const {MomentErrorMessages} = require('../constant/app.constant')

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
            select_comment_list: `
                SELECT 
                moment.id as moment_id,
                moment.content as moment_content,
                moment.user_id as moment_user_id,
                moment.create_time as moment_create_time,
                moment.update_time as moment_update_time, 
                user.name as user_name,
                user.create_time as user_create_time,
                user.update_time as user_update_time
                FROM moment LEFT JOIN user 
                ON user.id = moment.user_id LIMIT ?, ?;
            `,
            select_comment_list_by_id: `
                SELECT 
                moment.id as moment_id,
                moment.content as moment_content,
                moment.user_id as moment_user_id,
                moment.create_time as moment_create_time,
                moment.update_time as moment_update_time, 
                user.name as user_name,
                user.create_time as user_create_time,
                user.update_time as user_update_time
                FROM moment LEFT JOIN user 
                ON user.id = moment.user_id WHERE moment.id = ?;
            `,
            update_comment: `
                UPDATE moment SET content = ? WHERE id = ?;
            `,
            get_user_id_by_id: `
                SELECT * FROM moment WHERE id = ?;
            `
        }
        this.__createTable()
    }

     __createTable() {
        try {
            connectionPool.execute(this.__statement.create_table)
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
            const [res] = await connectionPool.execute(this.__statement.select_comment_list_by_id, [id])
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
}

const momentService = new MomentService()
module.exports = momentService