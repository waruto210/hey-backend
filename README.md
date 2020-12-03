# hey-backend

## 使用 docker 运行 PostgreSQL 数据库服务

```bash
docker run -d \
    --name postgres-server \
    -e POSTGRES_PASSWORD=hey-backend \
    -p 5432:5432 \
    postgres
```

## 使用 docker 运行 minio 对象存储服务

```bash
docker run -d -p 9001:9000 --name minio1 \
  -e "MINIO_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE" \
  -e "MINIO_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
  minio/minio server /data
```
