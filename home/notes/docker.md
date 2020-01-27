# Docker

Once you get a bit of a rhythm with docker, it becomes pretty
fun. Here are notes I took while reading some Docker books. Two good
ones that I'd recommend are:

- Using Docker
- Docker in Action

## Useful commands

-   `docker inspect <containerid>` - Shows IPAddress among other things.
-   `docker diff <containerid>` - List of files changed in the container.
-   `docker logs <containerid>` - list of everything that happened in the container.
-   `docker start <containerid>` - Start an exited/stopped container. START IS FOR CONTAINERS.
-   `docker rm <containerid>` - Remove a container.

-   `docker run -it --name mynewcontainer centos bash` - Run bash in a container called 'mynewcontainer' with centos as the base.
-   `docker commit mynewcontainer arun/mynewcontainer` - Create an image out of a container (either running or stopped).
-   `docker run arun/mynewcontainer echo hi` - Run echo on a new container and exit.
-   `docker build -t arun/mynewcontainer .` - Read Dockerfile from PWD and build a new container with that tag.
-   `docker push arun/mynewcontainer` - Push to docker hub or some other registry.
-   `docker pull arun/mynewcontainer` - Pull from docker hub or some other registry.
-   `docker run arun/mynewcontainer` &#x2013;name test -d /usr/bin/nginx - daemonize and run a pulled image. RUN IS FOR IMAGES.
-   `docker run --rm -it --link myredis:redis redis /bin/bash` - Woah. We ran another container and linked it to the existing 'myredis' container as 'redis' on the new one, i.e. /etc/hosts has an entry called 'redis' pointing to the old one.

## Cleanup

### Old and busted

-   `docker rmi $(docker images --filter "dangling=true" -q --no-trunc)` - For images
-   `docker rm -v $(docker ps -aq -f status=exited)` - Remove all exited containers.

### New hotness

-   `docker system prune`
-   `docker container prune`
-   `docker network prune`
-   `docker volume prune`

Difference between Stopped Container and Image: stopped container
retains its changes, settings, metadata, filesystem, runtime
configuration, etc. Images don't have runtime information.

## Dockerfile

    FROM centos:7
    MAINTAINER Beech Team <beechbld@cisco.com>
    RUN yum update && yum install -y emacs

Note: each command creates a layer, so try to squeeze stuff into a single command.

Then build it like this:

``` sh
docker build -t test/myemacs .
```

And run it like this:

``` sh
docker run test/emacs emacs .bashrc
```

If you add this line to the Dockerfile:

`ENTRYPOINT ["/usr/bin/emacs"]`

then you can directly run the container and pass the args without
mentioning the command, i.e.

``` sh
docker run test/emacs .bashrc
```

COPY in a Dockerfile instructs docker to copy a file from the host to the container. e.g.

`COPY entrypoint.sh /`

VOLUME is used to just use the host's filesystem for persistent data. e.g.

`VOLUME /home/arunsrin/data:/root/data`

To do it at run time, do this:

``` sh
docker run -it -v `pwd`:/root arunsrin/testpy
```

Instead of VOLUME, if you use ADD or COPY, it'll be baked into the
image and available to anyone who downloads
it. e.g. requirements.txt. Use ADD or COPY for making it part of the
image, and VOLUME for sharing data between host and container. Unlike
COPY, ADD also accepts URLs as a source, and unpacks it if its an
archive. e.g.  

`ADD . /python-oauth`

When running a command like `docker build -t asda/asd .` , the '.' is
the build context. It's contents are tar'd and sent to the docker
daemon so that ADD and COPY commands work seamlessly. Don't run this
on a large folder like `~` !!

## docker-compose: stop all containers when one dies

From
[here](https://stackoverflow.com/questions/33799885/how-to-stop-all-containers-when-one-container-stops-with-docker-compose#41841714):

```
docker-compose up --abort-on-container-exit

```

This will stop all containers launched via `docker-compose` when one of the
containers stops.
