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

// import-dependencies part
const KoaRouter = require('@koa/router');
const userController = require('../controllers/user.controller');
const {
    userMiddlewareValidate,  // to ensure the user info has
    userInfoHasAllFieldsMiddleware,  // to ensure the user info has all fields
    userInfoHasExistedInDbMiddleware,  // to ensure the user info has not existed in db
    userPasswordHandleLengthMiddleware,  // to ensure the user password has length
    userPasswordHandleFormatMiddleware,  // to ensure the user password has format
    userPasswordHandleStrengthMiddleware,  // to ensure the user password has strength
    userIsInDbMiddleware,  // to ensure the user info has existed in db
    createTableMiddleware  // to ensure the table has created
} = require('../middlewares/user.middleware');
const {verifyToken} = require("../utils/token.util");

// define-router part
const UserRouter = new KoaRouter({prefix: '/user'});

// define-router-api part
UserRouter.post(
    '/register',
    createTableMiddleware,
    userMiddlewareValidate,
    userInfoHasAllFieldsMiddleware,
    userInfoHasExistedInDbMiddleware,
    userPasswordHandleLengthMiddleware,
    userPasswordHandleFormatMiddleware,
    userPasswordHandleStrengthMiddleware,
    userController.create  // create user
)
UserRouter.post(
    '/login',
    // if has two password to validate, this func give client-side to handle
    createTableMiddleware,
    userMiddlewareValidate,
    userInfoHasAllFieldsMiddleware,
    userIsInDbMiddleware,
    userController.login  // login user
)

UserRouter.get(
    '/avatar/:userId',
    userController.getAvatarByUserID  // get user avatar  // get user info
)

// export-router part
module.exports = UserRouter;
