## 数据库开发

```sql
-- 创建 user 表，保存用户数据的表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,  
    name VARCHAR(20) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,  
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

-- 创建 moment 表，发表评论
CREATE TABLE IF NOT EXISTS moment(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    user_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);
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

### 发布评论接口

* `/moment/publish`
  * `post` 请求
  * 服务端验证 `Bearar Token` 以及 `Body` 评论信息

### 获取评论列表接口

* `/moment/commentList`
  * `get` 请求
  * 服务端不校验 `Bearar token`
  * 接口所需参数
    * `offset` 可选，默认为 0
    * `size` 可选，默认为 10

### 获取评论详情接口

* `/moment/detail/:momentId`
  * `get` 请求
  * 服务端无 `Bearar token` 校验
  * 需要含有动态参数: `momentId`

### 更新评论接口

* `/moment/update/:momentId`
* `patch` 请求
* 服务端有 `Bearar Token` 校验
* 客户端需要传递动态路由: `momentId` 以及 `body` 信息 