# MongoDB image for the compose stack of mern-bt.
#
# The service builds from this file instead of pointing at a registry image
# (R91). The base image is pinned by digest.
FROM mongo:7@sha256:c53852c00c23ca9f23fc39690350ffa9a80e3642fe8f96879726d8da0abe80a7

# The database files live in /data/db, which the compose stack mounts from
# var/mongo. The permissions of that directory are set on the host side.
WORKDIR /data/db
