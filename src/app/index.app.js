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

// import-part
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { routers } = require('../routers/index.router')
const { RegisterRoutesUtil } = require("../utils/router.util")
const initDatabase = require('../utils/initDatabase.util')
const cors = require('@koa/cors');

// init-part
const app = new Koa();

// middleware-part
app.use(bodyParser())
app.use(cors({
    origin: '*',  // 允许所有的源进行访问
    credentials: true,  // 允许携带cookie
    allowHeaders: ['*'],  // 允许的请求头
    exposeHeaders: ['*'],  // 允许的响应头
    allowMethods: ['*'],
    maxAge: 86400,
    allowCredentials: true,
}))
initDatabase()

// register-router-part
RegisterRoutesUtil(app, routers)

// export-part
module.exports = app