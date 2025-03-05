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

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const {UserErrorMessages} = require('../constant/app.constant');
const redisConnection = require("../middlewares/redis.middlwware");

// read private key and public key from keys directory
const keysDir = path.join(__dirname, '../keys');
const secretKey = {
    privateKey: fs.readFileSync(path.join(keysDir, 'private_key.pem')),
    publicKey: fs.readFileSync(path.join(keysDir, 'public_key.pem'))
}

// store token
const storeToken = async (payload, ctx) => {
    try {
        let token = await redisConnection().get(
            `${payload.name}_${payload.id}_token`
        )
        if (token === null) {
            token = await jwt.sign(payload, secretKey.privateKey, {
                algorithm: 'RS256',
                expiresIn: '14d',
            });
        }
        ctx.set('Authorization', `Bearer ${token}`)
        return token;
    } catch (_) {
        ctx.app.emit("error", UserErrorMessages.TOKEN_GENERATE_FAILED, ctx)
    }
}


// verify token middleware
const verifyToken = async (ctx, next) => {
    let token = ctx.headers.authorization || ctx.query.token || ctx.request.body.token;
    if(!token) {
        ctx.app.emit("error", UserErrorMessages.TOKEN_IS_REQUIRED, ctx)
    }
    const reg = /^Bearer\s/
    if (!reg.test(token)) {
        ctx.app.emit("error", UserErrorMessages.TOKEN_FORMAT_IS_INCORRECT, ctx)
    }
    token = token.replace('Bearer ', '')  // remove Bearer prefix
    try {
        const res = await jwt.verify(token, secretKey.publicKey, {
            algorithms: ['RS256'],
        });
        if (res) {
            ctx.user = res
            await next()
        } else {
            ctx.app.emit("error", UserErrorMessages.TOKEN_VERIFY_EXPIRED, ctx)
        }
    } catch (_) {
        ctx.app.emit("error", UserErrorMessages.TOKEN_VERIFY_FAILED, ctx)
    }
}

module.exports = {
    storeToken,
    verifyToken
}