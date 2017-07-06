STOCKMOOD
---------

> react+redux+expressjs web应用

### 准备工作
1.	依赖服务
	*	mysql
	*	mongodb
	*	redis
	
2.	安装nodejs依赖

	```
	npm install -g supervisor
	npm install -g webpack
	npm install -g pm2 (线上环境)
	npm install
	```

3.	设置配置文件
	*	`./config/devSettings`	本地开发
	*	`./config/dailySettings`	日常环境	
	*	`./config/productionSettings`	线上环境

### 启动
*	本地开发环境
	
	``` 
	npm run dev
	```

*	构建
	
	```
	npm run build
	```

*	启动线上环境(build + 守护进程)

	```
	npm run production
	```