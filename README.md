## Juwenzhang_hub
### used dependencies
* 主要使用的第三方依赖包
  * koa  -- koa框架依赖
  * @koa/router  -- 路由依赖
  * koa-bodyparser  -- 请求体解析依赖
  * nodemon -- 自动重启服务依赖
  * dotenv -- 配置文件依赖
    * const SERVER_PORT = dotenv.config().parsed.SERVER_PORT
  * mysql2 -- 数据库依赖

### 结构划分
* 结构划分能够细粒度就尽量细粒度的实现吧，该思想主要是学习了线代的开发模式吧，插件化的思想
  * 从而实现我们的代码的可读性以及降低代码的冗余度吧
  * 导出的规范学习: web-infra社区 中的 modern.js 的一些规范吧，但是也添加了自己的一些个人特色吧
* 同时文件名都和目录名一一实现对应吧
> * main.js -- koa 服务的启动文件
> * app
>   * index.app.js -- koa 的配置文件
> * config
>   * server.config.js -- 服务器配置文件
> * routers
>   * index.router.js -- 路由统一暴露
>   * user.router.js -- 用户路由
> * controllers
>   * user.controller.js -- 用户控制器
> * services
>   * user.service.js -- 用户服务
> * middlewares
>   * mysql.middleware.js -- mysql 中间件
> * utils
>   * router.util.js -- 路由工具

### 期望
* 本来想集成 ts 的，但是由于 ts 代码的书写是代码的设计先于代码的实现，相当于多了一步代码设计的一步
* 同时代码设计的这一步也是会耗费很多时间的，所以说这里就不集成 ts 了
  * 如果需要进行使用 ts 进行重构的话，你们的操作可以是:
    * npm install typescript
    * npm install @types/koa @types/koa-router @types/koa-bodyparser @types/node
  * 使用 ts 进行工程化的开发是一个十分困难的呐，代码的设计十分的难受，以及使用 ts 后还需要对代码进行新的构建
  * 因为本项目主要是想完成一个细粒度开发 nodejs 服务器的 nodejs-demo 罢了，就不集成 ts 了吧，后面再出一个 ts-nodejs-server 吧
  * https://juejin.cn/post/7349569626341081140 这文章, 可以先参考一下吧