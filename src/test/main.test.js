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

const { app } = require('../app/index.app');
const { SERVER_PORT, SERVER_URL } = require('../config/server.config');
const handleError = require('../utils/handleError.util');
const { describe, it, expect } = require('jest');

// Jest Test
if (typeof app?.listen === 'function') {
    app.listen(SERVER_PORT, () => {
        console.log('koa server has started successfully');
        handleError();
    });
} else {
    console.error('app.listen is not a function');
}

jest.mock('../config/server.config', () => ({
    SERVER_PORT: 3000,
    SERVER_URL: 'http://localhost:3000'
}));

jest.mock('../utils/handleError.util', () => jest.fn());

describe('main.js', () => {
    it('should start the server and log the correct message', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        require("../main")

        expect(app.listen).toHaveBeenCalledWith(SERVER_PORT, expect.any(Function));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('koa server has started successfully'));
        expect(handleError).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});