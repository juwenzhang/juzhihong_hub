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

const connectionPool = require('../middlewares/mysql.middleware');
class FileService {
    async uploadFile(filename, encoding, mimetype, size, user_id, ctx){
        const statement = `
            INSERT INTO user_avatar(filename, encoding, mimetype, size, user_id) VALUES (?, ?, ?, ?, ?) 
        `
        try {
            const [result] = await connectionPool.execute(
                statement,
                [filename, encoding, mimetype, size, user_id]
            );
            return result;
        } catch (error) {
            console.log(error);
            ctx.body = {
                status: 500,
                message: "fail upload avatar",
                data: {
                    url: "",
                },
            };
        }
    }

    async getAvatarByUserID(user_id, ctx){
        const statement = `
            SELECT * FROM user_avatar WHERE user_id = ?
        `
        try {
            const [res] = await connectionPool.execute(
                statement,
                [user_id]
            );
            return res[res.length - 1];
        } catch (error) {
            console.log(error);
            ctx.body = {
                status: 500,
                message: "fail get avatar",
                data: {
                    url: "",
                },
            };
        }
    }
}

const fileService = new FileService();
module.exports = fileService;