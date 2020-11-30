# hey-backend

## 使用docker运行PostgreSQL数据库服务
```bash
docker run -d \
    --name postgres-server \
    -e POSTGRES_PASSWORD=hey-backend \
    -p 5432:5432 \
    postgres
```