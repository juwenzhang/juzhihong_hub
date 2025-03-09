> * 接口文档地址: https://www.postman.com/juwenzhang/workspace/juwenzhanghub
> * 当然还在开发中，肯定是没有部署的呐，后面部署和开发好了后，文档自会更新😊😊😊
> * 该仓库的接口文档的话，请看: `koa_server-collection`

## 数据库开发

> * `user table` 和 `moment table` 是一对多关系，一个用户可以有多个动态吧
> * `user table` 和 `comment table` 是一对多关系，一个用户可以有多个评论吧
> * `moment table` 和 `comment table` 是一对多关系，一个动态可以有多个评论吧
>   * 客户端判断该评论是否是二级评论的标志是服务端数据中的 `comment_id` 是否为 `null`

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS your_database_name;

-- 创建 user 表，保存用户数据的表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,  
    name VARCHAR(20) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,  
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

-- 创建 moment 表，发表动态吧
CREATE TABLE IF NOT EXISTS moment(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    user_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 创建 comment 表，发表子评论
CREATE TABLE IF NOT EXISTS comment(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    user_id BIGINT NOT NULL,  -- 绑定用户表
    comment_id BIGINT NULL,  -- 绑定评论表
    moment_id BIGINT NOT NULL,  -- 绑定动态表
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE,
    FOREIGN KEY(moment_id) REFERENCES moment(id) ON DELETE CASCADE
);

-- 创建 label 标签表吧
CREATE TABLE IF NOT EXISTS label(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- label 和 moment 之间的关系表
CREATE TABLE IF NOT EXISTS moment_label(
	moment_id BIGINT NOT NULL,
    label_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (moment_id, label_id),  -- 联合主键吧
    FOREIGN KEY(label_id) REFERENCES label(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 头像信息表
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
```

```sql
-- 分页查询 + 连表查询
SELECT 
JSON_OBJECT(
    'user_id', user.id, 
    'user_name', user.name, 
    'user_create_time', user.create_time, 
    'user_update_time', user.update_time
) AS user_info,
JSON_OBJECT(
    'moment_id', moment.id,
    'moment_content', moment.content,
    'moment_user_id', moment.user_id,
    'moment_create_time', moment.create_time,
    'moment_update_time', moment.update_time    
) AS moment_info,
(SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id) AS comment_count
FROM moment LEFT JOIN user 
ON user.id = moment.user_id
LIMIT ?, ?
```

```sql
-- 连表查询 + 聚合查询
SELECT 
JSON_OBJECT(
    'user_name', user.name,
    'user_create_time', user.create_time,
    'user_update_time', user.update_time
) AS user_info,
JSON_OBJECT(
    'moment_id', moment.id,
    'moment_content', moment.content,
    'moment_user_id', moment.user_id,
    'moment_create_time', moment.create_time,
    'moment_update_time', moment.update_time    
) AS moment_info,
JSON_ARRAYAGG(
    JSON_OBJECT(
        'comment_id', comment.id,
        'comment_content', comment.content,
        'comment_user_id', comment.user_id,
        'comment_moment_id', comment.moment_id,
        'comment_comment_id', comment.comment_id,
        'comment_author_info', JSON_OBJECT(
            'comment_author_id', comment_user.id,
            'comment_author_name', comment_user.name,
            'comment_author_create_time', comment_user.create_time,
            'comment_author_update_time', comment_user.update_time
        ),
        'comment_create_time', comment.create_time,
        'comment_update_time', comment.update_time
    )
) AS comment_infos,
(SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id) AS comment_count
FROM moment 
LEFT JOIN user ON user.id = moment.user_id 
LEFT JOIN comment ON comment.moment_id = moment.id
LEFT JOIN user AS comment_user ON comment_user.id = comment.user_id
WHERE moment.id = ?
GROUP BY moment.id;
```

## 开发准备

* 使用的 `nodejs web server` 开发框架是: `koa`

* 我们的开发规范的话全局使用了 `jwt` 机制，服务器采用的是 Bearar Token 校验吧，所使用了的依赖包是: `jsonwebtoken`

* 使用的是我们的 `mysql` 关系型数据库吧，使用的 `nodejs` 驱动是: `mysql2` 

* 使用了后端路由的形式实现我们的开发吧，所依赖的包是: `koa-router` | `@koa/router`

* 进行请求体 `json` 格式解析的依赖包是: `koa-bodyparser`

* 使用替代 `jwt` 的 `session-cookie` 机制的话，使用的是: `koa-session`

* 使用的密码加密机制是: `bcryptjs`

* 进行生成颁发 `token` 令牌方式，使用了秘钥对，使用的工具是: `openssl`

* `multer @koa/multer` 实现的是对我们的 `file` 文件上传的依赖包是: `multer`

  * ```bash
    # 生成私钥
    openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:204
    # 生成公钥
    openssl rsa -in private_key.pem -pubout -out public_key.pem
    ```

* 进行保存用户 `token` 信息使用的依赖是: `ioredis`

* 获取全局配置 `.env` 信息的工具是: `dotenv`

* 开发使用的调试启动工具是: `nodemon`

* 后续集成 ts 使用的自动化执行依赖: `ts-node-dev`

* 集成支持 ts 的几个依赖包: `typescript` | `ts-node` | `tslint` | `typescript` | `@types/node`  | `@type/koa`

  * 当然现在还不集成，计划安排是使用我们的 `memorepo` 架构设计，实现我们的重构为两个版本的 `node_server`
    * `js_node_server` | `ts_node_server`

## 架构组织

```
docs--   文档目录
src--    源码目录
---app          服务器总的配置文件
---config       获取配置信息文件
---constant     项目静态变量文件
---keys         项目密钥对文件
---controllers  项目中联系路由和数据库之间的中间控制器
---middlewares  项目中自定义中间件
---routers      项目中 api 接口路由定义
---services     操作数据库模型的定义
---utils        整个项目中的工具函数
---main.js      项目启动文件
.env               项目配置文件
.gitignore git     上传忽略文件
LICENCE github     认证文件
package.json npm   配置依赖文件，项目管理文件
package-lock.json  项目依赖版本锁定文件
README.md          项目阅读文档
```

## API 文档

> * koa 服务器获取动态路由参数的方式为: `ctx.params`
> * koa 服务器获取查询参数的方式为: `ctx.request.query`
> * koa 服务器获取请求体数据的方式为: `ctx.request.body`
> * koa 服务器返回响应数据的方式为： `ctx.body`

### 用户注册接口

* `/user/register`

  * 用户注册接口

  * 校验形式: `query-params` 和 `body` 格式校验

  * 必须字段:

    * `name` : `string`
    * `password`: `string`

  * `query-params`

    * `/user/register?name=juwenzhang&password=123456%jJ`

  * `body`

    * ```json
      {
          "name": "juwenzhang",
          "passsword": "123456@jJ"
      }
      ```

  * 返回信息为:

    * `注册成功`

      * ```json
        {
            "code":0,
            "msg":"success",
            "status":200,
            "ok":true,
            "desc":"用户创建成功",
            "data":{
                "fieldCount":0,
               "affectedRows":1,
               "insertId":15,
               "info":"",
               "serverStatus":2,
               "warningStatus":0,
               "changedRows":0
            }
        }   
        ```

    * `注册失败，用户已经存在`

      * ```json
        {
            "code":-1002,
            "message":"用户名已存在"
        }
        ```

    * `注册失败，缺失字段`

      * ```json
        {
            "code":-1001,
            "message":"用户名或密码不能为空"
        }
        ```

### 用户登录接口

* `/user/login`

  * 用户登录接口

  * 必须字段: name 和 password

  * `登录成功，但是凭证未过期`

    * ```json
      {
          "code":0,
          "msg":"success",
          "status":200,
          "ok":true,
          "desc":"欢迎回来😊😊~~~",
          "data":{
              "id":15,
              "name":"juwenzhang",
              "token":"token"
          }
      }
      ```

  * `登录成功，但是没有凭证`

    * ```json
      {
          "code":0,
          "msg":"success",
          "status":200,
          "ok":true,
          "desc":"登录成功",
          "data":{
              "id":15,
              "name":"juwenzhang",
              "token":"token"
          }
      }
      ```

  * `登录失败，因为缺失字段`

    * ```json
      {
          "code":-1001,
          "message":"用户名或密码不能为空"
      }
      ```

### 发布动态接口

* `/moment/publish`
  * `post` 请求
  * 服务端验证 `Bearar Token` 以及 `Body` 评论信息

### 获取动态列表接口

* `/moment/commentlist`
  * `get` 请求
  * 服务端不校验 `Bearar token`
  * 接口所需参数
    * `offset` 可选，默认为 0
    * `size` 可选，默认为 10

### 获取动态详情接口

* `/moment/detail/:momentId`
  * `get` 请求
  * 服务端无 `Bearar token` 校验
  * 需要含有动态参数: `momentId`

### 更新动态接口

* `/moment/update/:momentId`
* `patch` 请求
* 服务端有 `Bearar Token` 校验
* 客户端需要传递动态路由: `momentId` 以及 `body` 信息 

### 删除动态接口

* `/moment/delete/:momentId`
* `delete` 请求
* 服务端有 `Bearar Token` 校验
* 客户端请求的时候需要进行携带 `Bearar Token` 信息，否则提示 `Token` 不存在

### 发布评论接口

* `/comment/publish`
* `post` 请求
* 服务端具有 `Bearar Token` 校验
* 客户端需要传递的参数是: `content` | `moment_id`
  * `content` 发布评论内容
  * `moment_id` 评论动态的动态 `id` 吧

### 回复评论接口

* `/comment/reply`
* `post` 请求
* 服务端具备 `Bearar Token` 校验的呐
* 客户端需要传递内容参数字段是 `content` | `content_id` | `moment_id`
  * 需要保证我们的回复的评论的 `moment_id` 和 评论的 `moment_id` 是同一个的呐，
    * 否则就是跨动态评论了，跨时空交流了
  * `content` 回复评论内容
  * `content_id` 回复的评论标识 `id`
  * `moment_id` 回复的是哪一条评论的标识 `id`

### 删除评论接口

* `/comment/delete/:commentId`
* `delete` 请求
* 服务端具备对 `Bearar Token` 校验吧