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

const labelService = require("../services/label.service");
class LabelController{
    async create(ctx, next) {
        const { labelName } = ctx.request.body;
        const res = await labelService.createLabel(ctx, labelName);
        if (res) {
            ctx.body = {
                code: 0,
                message: "label创建成功",
                data: res
            }
        } else {
            ctx.body = {
                code: 0,
                message: "label创建失败",
            }
        }
    }

    async getList(ctx, next) {
        const { page, pageSize } = ctx.query
        let res;
        if (page && pageSize) {
            res = await labelService.getLabelList(ctx, page, pageSize);
        } else {
            res = await labelService.getLabelList(ctx);
        }
        if (res) {
            ctx.body = {
                code: 0,
                message: "label获取成功",
                data: res
            }
        } else {
            ctx.body = {
                code: 0,
                message: "label获取失败",
                data: res
            }
        }
    }
}

const labelController = new LabelController();
module.exports = labelController