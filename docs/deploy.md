## nodejs 部署
### pm2 的简单使用
* 安装 pm2 吧
  * `npm install pm2 -g` | `npm install pm2`
* 常用命令
  * `pm2 start 启动文件.js`  实现的是启动我们的项目吧
  * `pm2 stop <app-name>`  实现的是停止我们的项目
  * `pm2 delete <app-name>`  实现的是删除我们的项目
  * `pm2 list`  实现是展示我们的启动的由 pm2 启动的项目列表吧
  * `pm2 restart <app-name>`  实现的是重启我们的项目
  * `pm2 reload <app-name>`  实现的是重启我们的项目
  * `pm2 start <app-name> --watch`  实现的是启动项目吧
  * `pm2 describe <app-name>` 实现的是展示我们的项目详情吧
* https://github.com/Unitech/pm2 这个是pm2的github 地址，可以看看吧
* ssh 连接服务器的操作是
  * `ssh username@ipAddress`
  * 修改服务器主机名
    * `hostnamectl --static set-hostname your-hostname`

### 准备环境
* nodejs 环境搭建
  * `dnf --help` 命令，查看所有的 dnf 命令
  * `dnf search nodejs` 搜索是否具备nodejs 
  * `dnf info nodejs` 查看 nodejs 的信息
  * `dnf install nodejs` 安装 nodejs
  * `node --version` 查看 nodejs 版本
    * 还可以使用 nvm | nrm | n 来控制 npm 的版本以及镜像源使用吧
      * `n install lts` 安装 lts 版本，稳定版本
      * `n use latest` 使用 latest 最新的版本
* mysql 环境搭建
  * `dnf search mysql-server` 搜索 mysql
  * `dnf install mysql-server` 安装 mysql  
  * `systemctl start mysqld`  启动 mysql
  * `systemctl enable mysqld` 开机启动 mysql
  * `systemctl status mysqld`  查看 mysql 状态
  * `systemctl stop mysqld` 停止 mysql
  * `systemctl restart mysqld` 重启 mysql
  * mysql 的配置
    * `mysql_source_installation` 配置 mysql config
      * `config password: 0-no 1-middle 2-strong  2`
      * `remove anonymous user: 0-no 1-yes  1`
      * `disallow remote root: 0-no 1-yes  n`
      * `remove test database: 0-no 1-yes  y`
      * `reload privilege tables: 0-no 1-yes  y`
      * 配置完成之后，重启 mysql
        * mysql -u root -p  -- 连接 mysql
```sql
show databases;  -- 查看数据库
use mysql;  -- 选择数据库 mysql
select host,user from user;
update user set host = '%' where user = 'root';  -- 修改 root 的 host 为 %，可以被任何主机实现访问吧
flush privileges;  -- 刷新权限，让所有的修改生效
``` 
* redis 环境搭建
  * `dnf search redis`
  * `dnf install redis`
  * `systemctl start redis`
  * `systemctl enable redis`
  * `systemctl status redis`
* 代码的迁移
  * `dnf search git`
  * `dnf install git`
  * `git clone git@github.com:username/project.git`
  * `npm install`
  * `npm run start:nodemon` 这个时候我们的项目就直接启动了

### 跨域问题的解决
> 这个就是我们的计算机网络相关的知识了
* webpack 和 vite 配置解决方案
  * 就是配置我们的代理来实现的是我们的解决跨域问题的呐
* 常见的解决跨域问题方案
  * 方案一: 静态资源 和 API资源 部署在同一个服务器上面
  * 方案二: 配置CORS 跨域资源共享
  * 方案三: node 的服务器代理（就是webpack 和 vite 的配置）
  * 方案四: 使用 nginx 代理
* 其他的解决方案
  * jsonp 跨域解决方案
  * postMessage 跨域解决方案
  * websocket 跨域解决方案，就是将所有的接口的请求从 http 转化为 socket套接字的形式解决跨域吧
* 跨域实际上的话是我们的后端的主要任务吧