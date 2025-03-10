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

const fileService = require("../services/file.service");
const userService = require("../services/user.service");
const { SERVER_URL } = require("../config/server.config");
class FileController {
    async uploadFile(ctx, next) {
        try {
            const { file } = ctx.request;
            const {
                filename,
                encoding,
                mimetype,
                size
            } = file
            const user_id = ctx.user.id;
            const res = await fileService.uploadFile(
                filename, encoding, mimetype, size, user_id, ctx
            )
            const res2 = await userService.updateUserAvatarUrl(
                `${SERVER_URL}/user/avatar/${user_id}`, user_id, ctx
            )
            ctx.body = {
                status: 200,
                message: "success upload avatar",
                data: {
                    filename,
                    encoding,
                    mimetype,
                    size,
                    ...res
                },
            };
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
}

const fileController = new FileController();
module.exports = fileController;