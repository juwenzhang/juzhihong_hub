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
const momentController = require('../controllers/moment.controller');
const { verifyToken } = require('../utils/token.util');
const {
    verifyMomentPermissionMiddleware,
    createTableMiddleware
} = require("../middlewares/moment.middleware");
const {
    verifyLabelIsExistMiddleware, handleLabelMiddleware
} = require("../middlewares/label.middleware");

const MomentRouter  = new KoaRouter({ prefix: '/moment' });

MomentRouter.post(
    '/publish',
    createTableMiddleware,
    verifyToken,
    momentController.create
);

MomentRouter.get(
    '/commentList',
    createTableMiddleware,
    momentController.getCommentList
);

MomentRouter.get(
    '/detail/:momentId',
    createTableMiddleware,
    momentController.getMomentById
);

MomentRouter.patch(
    '/update/:momentId',
    createTableMiddleware,
    verifyToken,
    verifyMomentPermissionMiddleware,
    momentController.updateComment
)

MomentRouter.delete(
    '/delete/:momentId',
    createTableMiddleware,
    verifyToken,
    verifyMomentPermissionMiddleware,
    momentController.deleteComment
)

MomentRouter.post(
    '/:momentId/labels',
    verifyToken,  // test token
    verifyMomentPermissionMiddleware, // test permission
    verifyLabelIsExistMiddleware, // test label is exist
    handleLabelMiddleware,
    momentController.addLabels
)

module.exports = MomentRouter;