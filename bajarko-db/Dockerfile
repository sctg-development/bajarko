FROM postgres:15-alpine
# certstrap is a tool to create and manage certificates [see](https://github.com/square/certstrap)
# ./certstrap init --common-name sctg-development-fake-CA --passphrase ""
# ./certstrap request-cert --common-name postgresdb  --domain localhost,localhost.local,postgresql,postgresql.local,bajarko-db,bajarko-db.local --passphrase ""
# ./certstrap sign postgresdb --CA sctg-development-fake-CA --passphrase ""
COPY ./out/postgresdb.key /var/lib/postgresql
COPY ./out/postgresdb.crt /var/lib/postgresql

COPY ./out/sctg-development-fake-CA.crt /var/lib/postgresql
COPY ./out/sctg-development-fake-CA.crl /var/lib/postgresql
COPY ./out/sctg-development-fake-CA.key /var/lib/postgresql

COPY ./ssl-conf.sh /usr/local/bin

RUN chown 0:70 /var/lib/postgresql/postgresdb.key && chmod 640 /var/lib/postgresql/postgresdb.key
RUN chown 0:70 /var/lib/postgresql/postgresdb.crt && chmod 640 /var/lib/postgresql/postgresdb.crt

RUN chown 0:70 /var/lib/postgresql/sctg-development-fake-CA.crt && chmod 640 /var/lib/postgresql/sctg-development-fake-CA.crt
RUN chown 0:70 /var/lib/postgresql/sctg-development-fake-CA.crl && chmod 640 /var/lib/postgresql/sctg-development-fake-CA.crl

COPY Dockerfile /
ENTRYPOINT ["docker-entrypoint.sh"] 

CMD [ "-c", "ssl=on" , "-c", "ssl_cert_file=/var/lib/postgresql/postgresdb.crt", "-c",\
    "ssl_key_file=/var/lib/postgresql/postgresdb.key", "-c",\
    "ssl_ca_file=/var/lib/postgresql/sctg-development-fake-CA.crt", "-c", "ssl_crl_file=/var/lib/postgresql/sctg-development-fake-CA.crl" ]

# Building the image
# To build the image, you can use the following command:
# docker buildx build --platform=linux/arm64,linux/amd64 --tag sctg/bajarko-db:latest --tag sctg/bajarko-db:15-alpine --tag sctg/bajarko-db:15 --push .
#
# Running the container
# To run the container without data persistence, you can use the following command:
# docker run -it -p 5432:5432 --name medusa_db -e POSTGRES_PASSWORD=postgres sctg/bajarko-db:15-alpine
#
# To run the container with data persistence, you can use the following command:
# docker run -it -p 5432:5432 --name medusa_db -e POSTGRES_PASSWORD=postgres -v /path/to/your/data:/var/lib/postgresql/data sctg/bajarko-db:15-alpine
#
# To use the client tools, you can run the following sample commands:
# docker run -it sctg/bajarko-db:15-alpine psql --help
# docker run -it sctg/bajarko-db:15-alpine psql "postgresql://postgres:postgres@192.168.2.45?sslmode=require"
# docker run -it sctg/bajarko-db:15-alpine psql "postgresql://postgres:postgres@192.168.2.45?sslmode=require" -c "CREATE USER medusa WITH PASSWORD 'secret_password';"
# docker run -it sctg/bajarko-db:15-alpine psql "postgresql://postgres:postgres@192.168.2.45?sslmode=require" -c "CREATE DATABASE medusa OWNER medusa;"
# docker run -it sctg/bajarko-db:15-alpine psql "postgresql://postgres:postgres@192.168.2.45?sslmode=require" -c "GRANT ALL PRIVILEGES ON DATABASE medusa TO medusa;"
# 
# To backup the database, you can use the following command:
# docker run -e PGPASSWORD=postgres -it sctg/bajarko-db:15-alpine pg_dump -h 192.168.2.45 -U postgres -d medusa > $PROJECT_ROOT/bajarko-db/medusa_backup.sql
#
# To restore the database, you can use the following command:
# cat $PROJECT_ROOT/bajarko-db/medusa_backup.sql | docker run -i -e PGPASSWORD=postgres sctg/bajarko-db:15-alpine psql -h 192.168.2.45 -U postgres -d medusa