# 基础镜像：Node.js 18 的 Alpine 版本
FROM node:18-bullseye-slim AS base

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    perl \
    libidn11 \
    libgomp1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制项目所有文件
COPY . .

# 安装balstp应用
RUN cd /app/program/blast && tar -zxvf ncbi-blast-2.16.0+-x64-linux.tar.gz && cd /app

# 构建 Next.js 应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "start"]