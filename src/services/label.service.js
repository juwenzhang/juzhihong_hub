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

const connectionPool = require("../middlewares/mysql.middleware");

class LabelService {
    constructor() {
        this.__statement = {
            create_table: `
                CREATE TABLE IF NOT EXISTS label(
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(50) NOT NULL UNIQUE,
                    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `,
            create_label: `
                INSERT INTO label(name) VALUES (?);
            `,
            get_label_list: `
                SELECT * FROM label LIMIT ?, ?;
            `,
            select_label_name: `
                SELECT * FROM label WHERE name = ?;
            `
        }
    }

    async createTable() {
        try {
            await connectionPool.execute(this.__statement.create_table)
        } catch (error) {
            console.log(error)
        }
    }

    async createLabel(ctx, labelName) {
        try {
            const [res] = await connectionPool.execute(
                this.__statement.create_label,
                [labelName]
            )
            return res;
        } catch (error) {
            ctx.body = {
                code: 500,
                message: '创建标签失败'
            }
        }
    }

    async getLabelList(ctx, page = "0", pageSize = "10") {
        try {
            const [res] = await connectionPool.execute(
                this.__statement.get_label_list,
                [page, pageSize]
            )
            return res;
        } catch (error) {
            ctx.body = {
                code: 500,
                message: '获取标签列表失败'
            }
        }
    }

    async getLabelByName(ctx, labelName){
        try {
            const [res] = await connectionPool.execute(
                this.__statement.select_label_name,
                [labelName]
            )
            return [!!res[0], res[0]?.id]
        } catch (error) {
            ctx.body = {
                code: 500,
                message: '服务器错误'
            }
        }
    }
}

const labelService = new LabelService();
module.exports = labelService;