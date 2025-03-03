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

/**
 * @description Check if the router is an array
 * @param {Array} routers - Router array
 * @return {Array} routers - Router array
 */
function IsArray(routers) {
    return Array.isArray(routers) ? routers : [];
}

/**
 * @description Get unique router
 * @param {Array} routers - Router array
 * @return {Array} routers - Router array
 */
function GetUniqueRouters(routers) {
    const new_routers = IsArray(routers);
    return new_routers.filter((router, index) => {
        return new_routers.indexOf(router) === index;
    });
}

/**
 * @description Get router
 * @param {Array} router - Router array
 * @return {Object} router - Router object
 */
function GetRouterUtil(router) {
    if (!router || typeof router.routes !== 'function' ||
        typeof router.allowedMethods !== 'function') {
        return null;
    }
    return router;
}

/**
 * @description Register routes
 * @param {Object} app - Koa application
 * @param {Array} routers - Router array
 */
function RegisterRoutesUtil(app, routers) {
    const uniqueRouters = GetUniqueRouters(routers);
    uniqueRouters.forEach((router) => {
        const validRouter = GetRouterUtil(router);
        if (validRouter) {
            app.use(validRouter.routes()).use(validRouter.allowedMethods());
        } else {
            return null
        }
    })
}

module.exports = {
    IsArray,
    GetRouterUtil,
    GetUniqueRouters,
    RegisterRoutesUtil,
}