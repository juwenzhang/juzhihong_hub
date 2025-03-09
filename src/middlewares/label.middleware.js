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

const labelService = require('../services/label.service');
const { LabelErrorMessage } = require('../constant/app.constant');

const createTableMiddleware = async (ctx, next) => {
    try {
        await labelService.createTable();
        await next();
    } catch (error) {
        ctx.app.emit("error", LabelErrorMessage.CREATE_LABEL_TABLE_ERROR, ctx);
    }
}

const verifyLabelIsExistMiddleware = async (ctx, next) => {
    const { labelNames } = ctx.request.body;
    if (!labelNames) {
        ctx.app.emit("error", LabelErrorMessage.LABEL_NAMES_IS_REQUIRED, ctx);
        return;
    }

    if (!Array.isArray(labelNames)) {
        ctx.app.emit("error", LabelErrorMessage.LABEL_NAMES_IS_NOT_ARRAY, ctx);
        return;
    }
    let results = [];
    for(let labelName of labelNames) {
        const res = await labelService.getLabelByName(ctx, labelName);
        results.push(res);
    }
    let labelStatus = {
        labelStatusSuccess: [],  // add success label
        labelStatusFail: []  // add fail label
    }
    results.map((item, index) => {
        if(item[0]) {
            labelStatus.labelStatusFail.push({
                index: index,
                labelName: labelNames[index],
                labelId: results[index][1]
            });
        } else {
            labelStatus.labelStatusSuccess.push({
                index: index,
                labelName: labelNames[index],
            });
        }
    })
    ctx.labelStatus = labelStatus;  // labelStatusSuccess will be add to label table
    await next();
}

const handleLabelMiddleware = async (ctx, next) => {
    const { labelStatusSuccess, labelStatusFail } = ctx.labelStatus;
    if(labelStatusSuccess.length > 0) {
        for(let item of labelStatusSuccess) {
            await labelService.createLabel(ctx, item.labelName);
        }
    }
    const labelStatusHandler = labelStatusSuccess.map(async (item) => {
        const res = await labelService.getLabelByName(ctx, item.labelName);
        return {
            index: item.index,
            labelName: item.labelName,
            labelId: res[1]
        }
    })
    ctx.labelStatus.labelId = [];
    for (let item of labelStatusFail) {
        ctx.labelStatus.labelId.push(item.labelId);
    }
    ctx.labelStatus.labelStatusSuccess = await Promise.all(labelStatusHandler);
    for(let item of ctx.labelStatus.labelStatusSuccess) {
        ctx.labelStatus.labelId.push(item.labelId);
    }
    await next();
}

module.exports = {
    createTableMiddleware,
    verifyLabelIsExistMiddleware,
    handleLabelMiddleware
}