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

const statementObj = {
    createUserTable: `
        CREATE TABLE IF NOT EXISTS user (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,  
            name VARCHAR(20) NOT NULL UNIQUE,  
            password VARCHAR(255) NOT NULL,  
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        );
    `,
    createMomentTable: `
        CREATE TABLE IF NOT EXISTS moment(
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            user_id BIGINT NOT NULL,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
        );
    `,
    createCommentTable: `
        CREATE TABLE IF NOT EXISTS comment(
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            user_id BIGINT NOT NULL,
            comment_id BIGINT NULL,
            moment_id BIGINT NOT NULL,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE,
            FOREIGN KEY(moment_id) REFERENCES moment(id) ON DELETE CASCADE
        );
    `,
    createLabelTable: `
        CREATE TABLE IF NOT EXISTS label(
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL UNIQUE,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `,
    createMoment_LabelTable: `
        CREATE TABLE IF NOT EXISTS moment_label(
            moment_id BIGINT NOT NULL,
            label_id BIGINT NOT NULL,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (moment_id, label_id),  -- 联合主键吧
            FOREIGN KEY(label_id) REFERENCES label(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `,
    createUserAvatarTable: `
        CREATE TABLE IF NOT EXISTS user_avatar(
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            filename VARCHAR(255) UNIQUE,
            encoding VARCHAR(50),
            mimetype VARCHAR(30),
            size BIGINT,
            user_id BIGINT,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `
}

const initDatabase = () => {
    try {
        for (const key in statementObj) {
            connectionPool.execute(statementObj[key])
        }
        console.log('数据库初始化完成')
    } catch (error) {
        console.log(error)
    }
}

module.exports = initDatabase