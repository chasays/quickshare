#!/bin/bash

# 设置环境变量
export NODE_ENV=production
export AUTH_ENABLED=true
export AUTH_PASSWORD=qq778899


# 启动应用
node --max-old-space-size=1024 app.js
