## session-cookie 机制
* `cookie` 
  * 是一种在浏览器和服务器之间传递数据的一种机制，它通过设置浏览器的 Cookie 来实现。
  * 通常设置 cookie 的话是我们的服务端来完成的，但是需要注意的是，我们的原本的 http 协议是无状态的
  * 所以说这个时候才出现了我们的 cookie 和 session 吧
  * 但是现在的话网络方面的交互的话都是通过我们的 jwt 来实现了吧，但是 cookie-session 机制还是存在的呐
* `cookie 的作用`
  * cookie 的作用主要是为了解决我们的服务端识别客户端身份的问题吧
  * cookie 主要用于在浏览器和服务器之间传递数据的一种机制，它通过设置浏览器的 Cookie 来实现。
* `cookie 的工作机制`
  * 客户端发送网络请求的时候，服务器会通过设置响应头中的 Set-Cookie 来设置客户端的 Cookie
  * 客户端收到服务器的响应后会自动将 Set-Cookie 中的内容保存到浏览器的 Cookie 中
  * 客户端下次再发送网络请求的时候，浏览器会自动将 Cookie 中的内容发送给服务器
* `cookie 分类`
  * cookie 有两种类型，一种是 内存-cookie, 一种是 持久化-cookie（硬盘-cookie）
    * `内存-cookie` 
      * 是指在浏览器内存中存储的 cookie，当浏览器关闭时，内存中的 cookie 会被清除，
      * 但是当浏览器重新打开时，内存中的 cookie 会重新加载到浏览器中。
    * `持久化-cookie`
      * 指的是保存在我们的硬盘中的数据吧，服务端是可以设置 cookie 的有效时间的
      * 当人为的手动删除 cookie 或者 cookie 过期了之后，我们的 cookie 就会失效了，
      * 这个时候客户端就需要向服务端重新发送请求，获取 cookie 了
      * 服务端的 cookie 过期时间一般是 14day 吧，django 中的默认是 14day
    * `判断是内存-cookie 还是持久化-cookie` 
      * 服务端没有设置 cookie 的过期时间，那么就是内存-cookie，这个时候在浏览器关闭的时候，自动清楚
      * 服务端设置了 cookie 的过期时间，那么就是持久化-cookie，这个时候在浏览器关闭的时候，不会自动清除，
        * 需要手动以及等待服务端的过期时间才会被删除
* `session-cookie 机制的优势`
  * session 是存储在服务端的一个用户客户端身份验证的会话维持的一个数据吧
  * session-cookie 机制就是将 session 的数据存储在客户端的 cookie 中，
    * 这样我们的服务端就可以通过客户端的 cookie 来识别客户端的 session 了
  * session-cookie 机制的好处就是
    * 服务端是十分的好控制客户端用户的在线和离线的判定的
    * 这样我们的服务端是相当于可以完全控制客户端了吧
* `cookie 生命周期`
  * 默认情况下是内存-cookie，当浏览器关闭的时候，自动清除
  * `expires` 和 `max-age` 是两种设置 cookie 的过期时间的方式
    * 这个时候我们的 cookie 就是一个硬盘持久化的 cookie 了，这两个属性主要是用于实现的是设置 cookie 的过期时间的呐
    * expires 使用的是一个很奇怪的时间格式，但是实际上也是可以设置 cookie 的过期时间的，所以说不用这个
    * max-age 是一个整数，表示以秒为单位的过期时间，表示多少秒后过期，易于操作，但是 expires 是比较麻烦的，所以说我们就使用这个吧
* `cookie 作用域`
  * 就是设置的是 cookie 可以被允许发送的 URL 的范围
    * 后面的单点 SSO 登录的时候，原理就是使用了 cookie 作用域机制吧
  * `domain` 属性
    * 该属性就是设置的是我们的 domain 域名，比如我们的域名是 juwenzhang.com，那么我们的 cookie 就可以设置成 .juwenzhang.com
    * 这些操作都是由服务器来实现的，客户端是自动完成的，所以说后端还是比较的累吧，都是`牛马`了
      * 默认的是: domain ==> origin
      * domain:baidu.com
  * `path` 属性
    * 指定主机下那些路径下的 cookie 都可以发送给服务器
      * Path=/docs
        * 那么在 /docs/index.html 和 /docs/detail.html 都可以发送 cookie 给服务器
* `当前的实现方案`
  * 不同的企业对于 cookie 和 jwt 机制的选择有一定的不同
  * 有的还是纯 cookie-session 机制
  * 有的是纯 jwt 机制 -- 对于我们的个人博客开发的话，常用的就是该模式吧，同时还会涉及到我们的 redis 数据库吧
  * 有的还是混合的 cookie-session 和 jwt
```html
<!-- 客户端 cookie 的设置 -->
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, 
        initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    >
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
  <script>
      // 设置内存-cookie
      // 客户端设置 cookie 的方式，cookie 的话主要是存储的是我们的键值对吧，基本上使用不到的
      // 但是设置的话是以: key1=value1&key2=value2&key3=value3 的形式存储的呐
      document.cookie = 'name=juwenzhang&pwd=123456&token=123456231344312'  // 内存-cookie，没有过期时间的设置哈
      // 进行后续的操作的话，可以先进行 split("&").forEach(item => { item.split("=") })
      
      // 设置硬盘 cookie
      // 主要的话就是添加两个字段 expires 和 max-age: s 为单位吧，两个是等价的呐
      document.cookie = 'name=juwenzhang&pwd=123456&token=123456231344312; expires=Thu, 18 Dec 2022 12:00:00 UTC;max-age=3600'
      
      // cookie 的分开设置
      document.cookie = 'name=juwenzhang; max-age=3600'
      document.cookie = 'pwd=123456; max-age=360'
      document.cookie = 'token=123456231344312; max-age=36000'
      console.log(document.cookie)
  </script>
</body>
</html>
```
* `cookie 服务端设置原理`
  * 对于我们的 cookie-session 机制的话，已经是我们的全盘由服务端来维护的，服务端来实现全盘的控制客户端的信息验证吧
    * 这样的 cookie-session 机制的话，服务端就是一个强有力的控制器吧，服务端是完全控制客户端的，这个就是以前的 session-cookie 机制的特性吧
    * 同时我们的服务端设置 cookie 的时候，在同一个作用域下进行访问多的话，浏览器是可以直接进行携带 cookie 凭证的，供服务器进行校验信息的
      * 可以允许的域名的话，也是由我们的服务端进行设置的呐，设置可以携带 cookie 凭证的域名的话就是通过 `domain` 属性来实现设置的呐
      * 在同一域名下的话，浏览器是直接携带 cookie 凭证的，所以可以进行访问的服务端提供的接口呐
      * 域名的话: 域名是: .juwenzhang.com
* koa-session
  * 这个是我们的 koa 框架中的实现 cookie 认证的一个中间件吧，帮助我们实现的是服务端进行 cookie 认证的
  * 该中间件的话使用起来是更加安全的呐，cookie 的话是明文的，所以安全性是相对较低，这个时候就不得不使用我们的中间件 koa-session 了吧
```javascript
const Koa = require('koa')
const koaRouter = require('@koa/router')
const koaSession = require('koa-session');

const app = new Koa()
app.use(koaSession({
  key: 'sessionId',  // 设置 sessionId 的 key
  maxAge: 1000 * 60 * 60 * 24,  // 设置 cookie 的过期时间，单位是毫秒，过期时间为 24 小时
  httpOnly: true,  // 设置 cookie 是否只能通过 HTTP 请求访问，默认为 true
  signed: true,  // 设置 cookie 是否需要签名，默认为 true
}, app));
app.keys = ['secret', "secretKey", "ctx", "juwenzhang"]  // 设置加密的密钥，用于对 sessionId 进行加密
const userRouter = new koaRouter({ prefix: '/user'})

userRouter.get('/login', async (ctx, next) => {
  // ctx.cookies.set("name", "juwenzhang", {  // 设置client-side的cookie
  //     maxAge: 1000 * 60 * 60 * 24,  // 设置cookie的过期时间，单位是毫秒，过期时间为: 24小时
  // })
  ctx.session.name = "juwenzhang"
  ctx.body = 'login success'  // 设置响应体: login success
})

userRouter.get('/list', async (ctx, next) => {
  // const name = ctx.cookies.get("name")  // 获取client-side的cookie，用于实现接口检验
  const name = ctx.session.name
  if (name !== "juwenzhang") {
    ctx.body = 'please login first'
    return
  }
  ctx.body = 'user list'
})

app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.listen(4000, () => {
  console.log('koa back-end is running at http://127.0.0.1:4000')
})
```
* `session-cookie 弊端`
  * 随着前后端的分离，cookie-session 的弊端是，cookie-session 的话，是服务端来维护的，服务端来进行校验的
  * 服务端来进行校验的话，如果服务端发生故障的话，那么就会导致我们的客户端的请求失败，所以这个机制是相对不安全的
  * cookie 客户端每次请求的时候，都会携带我们的 cookie 凭证，无形中增加了请求的次数，以及带来了流量的负载
  * cookie 是明文传递的，所以说存在一定的安全性，所以这个机制是相对不安全的
  * cookie 的大小是具备限制的，4kb，对于我们的复杂的业务逻辑的话是无法完成的呐
  * 对于除了浏览器之外的其他客户端，移动端（android, ios），必须手动的打开 cookie 和 session 的设置
  * 对于分布式系统和服务器集群的话，是没有一个合理的方案来实现解决解析 session 的规则的

## JSON_WEB_TOKEN（jwt） 机制
* JSON Web Token (JWT) 是一种开放标准（RFC 7519）
  * 同时我们的 token 的前后端校验机制也是十分常用的呐
  * JWT 是一种基于 JSON 的开放标准，它允许我们使用 JWT 来进行身份认证和授权
  * JWT 的模式的话可以实现的是
    * 前端进行交互的时候，设置请求头: authorization: token
    * 前端存储的话就是通过我们的: localStorage 或者 sessionStorage 来进行存储的
  * token 的使用步骤
    * 用户登录的时候，颁发 token
    * 其他接口用户访问的时候，进行验证 token 即可
* jwt 机制的话可以是我们的
  * `header` 校验
    * alg: 采用我们的加密算法，默认的加密算法是: HS256，采用的是同一个的密钥进行加密和解密的
    * typ: 采用我们的加密算法，默认的加密算法是: JWT
    * 一般的话会通过我们的 base64 进行加密的
  * `payload` 校验
    * 用于前后端交互期间携带我们的数据的，我们可以实现的是将我们用户的 id 或者说 name 或者 token 信息存放在我们的 payload 中
    * 默认使用的是 iat，来指定我们的令牌的颁发时间吧
    * 我们也是可以设置 token 的过期时间，默认是 1 天，但是可以设置成我们想要的时间
    * 任然使用的是我们的 base64 进行加密的
  * `signature` 校验
    * 设置一个我们的 secretKey 来进行加密的, 这个 secretKey 是我们自己设置的，可以设置成我们想要的内容
    * 使用的是我们的 HMAC-SHA256 算法进行加密的
    * 这个加密的算法是: header + payload + secretKey
    * 我们的 secretKey 一定需要设置我们的加密，该属性如果被暴露的话，是十分危险的呐
```javascript
const Koa = require('koa')
const koaRouter = require('@koa/router')
const jwt = require('jsonwebtoken');

const app = new Koa()
const userRouter = new koaRouter({ prefix: '/user'})

const secretKey = ""

// /user/login
userRouter.get('/login', async (ctx, next) => {
    // dispatch json web token
    // data from our server-db
    const payload = {
        id: 1,
        name: "juwenzhang",
    }
    const token = jwt.sign(payload, secretKey, {
        expiresIn: 60 * 60 * 24,
    })
    ctx.set("Authorization", token)
    ctx.body = {
        code: 200,
        message: "login success",
        data: {
            token: token,
            message: "login success",
        }
    }
})

// /user/list
userRouter.get('/list', async (ctx, next) => {
    // get token from client-side
    let token = ctx.headers.authorization
    if (!token) {
        ctx.body = {
            code: 401,
            message: "please login first",
        }
    } else {
        token = token.replace("Bearer", "")
    }
    
    // verify token
    try {
        const payload = jwt.verify(token, secretKey)
        ctx.body = {
            code: 200,
            message: "user list",
            data: {
                id: payload.id,
                name: payload.name,
                message: "user list",
                token: token,
            }
        }
    } catch (error) {
        ctx.body = {
            code: 401,
            message: "please login first",
        }
    }
})

app.use(userRouter.routes()).use(userRouter.allowedMethods())

/**
 * token in client
 * we can use authorization: token
 * we can use localStorage or sessionStorage to store our token
 * we can use body
 */

app.listen(4000, () => {
    console.log("koa back-end is running at http://127.0.0.1:4000")
})
```
* 为了保证我们的安全性的问题，所以说我们就不用上面的对称加密算法 HMAC-SHA256 了，而是使用非对称加密算法 RSA 来进行加密的
  * 非对称加密是怎么实现的呐？？？
    * 就是实现使用我们的 private-key 和 public-key 来进行加密解密的
    * 这个时候只能够使用 private-key 来进行加密，使用 public-key 来进行解密
    * 这个时候就相对安全了很多吧
    * openssl 来实现我们的生成 private-key 和 public-key
      * 尽量在我们的 mac 电脑中执行吧，因为 windows 的 openssl 是不支持的，但是是可以使用我们的 git-bash 来实现的呐
      * openssl -- 进入 ssl 的交互式命令行中吧
      * 或者说使用其他工具生成我们的公钥和私钥也是可以的呐
        * ssh-keygen -m PEM -t ed25519 -C "your.email@example.com"
        * 文章阅读可以是: https://coding.net/help/docs/repo/ssh/config.
```bash
# 注意为了项目中可以存在下面的密钥，我的操作是: mkdir keys
# cd keys
# 然后使用下面的命令，生成的密钥是: private_key.pem 和 public_key.pem 就会在当前目录 keys 下存在了
# 不是 mac 环境的话，请使用 git-bash 来执行下列命令，thanks!!!
# 生成私钥
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:204
# 生成公钥
openssl rsa -in private_key.pem -pubout -out public_key.pem
# 上面的就是我们服务端实现使用的非对称加密算法 RSA 来进行加密解密的密钥对了
```
```javascript
/**
 * 非对称加密算法 RSA 来进行加密解密
 * 使用我们的私钥来进行我们的服务器颁发服务器凭证
 * 使用我们的公钥来进行我们的客户端进行解密凭证
 */
const fs = require('fs')
const Koa = require('koa')
const koaRouter = require('@koa/router')
const jwt = require('jsonwebtoken');

const app = new Koa()
const userRouter = new koaRouter({ prefix: '/user'})

const secretKey = {
    privateKey: fs.readFileSync('./private_key.pem', 'utf8'),  // 可以不指定编码
    publicKey: fs.readFileSync('./public_key.pem', 'utf8'),  // 可以不指定编码
}

// /user/login
userRouter.get('/login', async (ctx, next) => {
  // dispatch json web token
  // data from our server-db
  const payload = {
    id: 1,
    name: "juwenzhang",
  }
  const token = jwt.sign(payload, secretKey.privateKey, {
    expiresIn: 60 * 60 * 24,
    algorithm: ['RS256', 'HS256', ''],  // 默认使用的加密是 HS256，但是我们的非对称加密的话，需要指定为 RS256，否则会报错
  })
  ctx.set("Authorization", token)
  ctx.body = {
    code: 200,
    message: "login success",
    data: {
      token: token,
      message: "login success",
    }
  }
})

// /user/list
userRouter.get('/list', async (ctx, next) => {
  // get token from client-side
  let token = ctx.headers.authorization
  if (!token) {
    ctx.body = {
      code: 401,
      message: "please login first",
    }
  } else {
    token = token.replace("Bearer", "")
  }

  // verify token
  try {
    const payload = jwt.verify(token, secretKey.publicKey)
    ctx.body = {
      code: 200,
      message: "user list",
      data: {
        id: payload.id,
        name: payload.name,
        message: "user list",
        token: token,
      }
    }
  } catch (error) {
    ctx.body = {
      code: 401,
      message: "please login first",
    }
  }
})
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.listen(4000, () => {
  console.log("koa back-end is running at http://127.0.0.1:4000")
})  
```