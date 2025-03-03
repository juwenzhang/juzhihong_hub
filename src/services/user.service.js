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

class UserService {
    constructor() {
        // use strategy pattern
        this.statement = {
            create_table: `
                CREATE TABLE IF NOT EXISTS user (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(20) NOT NULL UNIQUE,
                    password VARCHAR(20) NOT NULL,
                    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `,
        }
    }

    // create table method
    __createTable() {
        connectionPool.execute(this.statement.create_table)
    }

    create(user) {
        // create user table to ensure the table exists
        this.__createTable()
    }
}

const userService = new UserService();
module.exports = userService;