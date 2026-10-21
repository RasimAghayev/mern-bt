# MongoDB image for the compose stack of social-network-api.
#
# The service builds from this file instead of pointing at a registry image
# (R91). The base image is pinned by digest.
FROM mongo:9@sha256:dc28ed5a9d0fc616903c3f463bb1e53b92b49f441721b91926e87d90bf957ce8

# The database files live in /data/db, which the compose stack mounts from
# var/mongo. The permissions of that directory are set on the host side.
WORKDIR /data/db
