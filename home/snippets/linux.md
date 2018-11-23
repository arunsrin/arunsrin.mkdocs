My favourite OS. Been using it since 2004. Learnt the hard way, uphill
both ways. I used to borrow DVDs from the library at work and give it
a spin at home. I didn't have a working internet connection back then
so I'd have to take notes on the error message, research them the next
day at work, and fix it when I got back. Probably the most fruitful
time I've had to date.

I distro-hopped every few months, and my fondest memories are of
Slackware and, well, FreeBSD. I had a ton of fun with my Desktop:
setting up IPv6 tunnels, dynamic DNS, apache, squid, privoxy, and
generally playing with minimiastic window managers and the shell.

These days I stick with Fedora and love it.

## General Linux

### Centos 7 sources

Clone their helper repo first:

``` sh
git clone  https://git.centos.org/git/centos-git-common.git
```

Go to their [RPM project](https://git.centos.org/project/rpms) and
select a project to clone. I'm picking `coreutils` here. This repo has
a SPEC file and the patches to the original source.

``` sh
git clone https://git.centos.org/r/rpms/coreutils.git
```

The master branch is always empty. Checkout their `c7` branch to see
the SPECS and SOURCES folders for Centos 7, and run the helper script
to fetch the source.

``` sh
git checkout c7
../centos-git-common/get_sources.sh
```

### diff and patch

``` sh
cp somepackage somepackage-new
# make changes in somepackage-new
diff -crB somepackage somepackage-new > mychanges.patch
# give the patch to someone else, who can now do:
cd somepackage
patch -p1 < mychanges.patch
```

### ccache notes

Install from the repo as usual

``` sh
sudo yum install ccache -y
```

One way to set it up:

``` sh
bash-4.2 /bin$ cp ccache /usr/local/bin/
bash-4.2 /bin$ ln -s ccache /usr/local/bin/gcc
bash-4.2 /bin$ ln -s ccache /usr/local/bin/g++
bash-4.2 /bin$ ln -s ccache /usr/local/bin/cc
bash-4.2 /bin$ ln -s ccache /usr/local/bin/c++
```

### Change timezone in centos:

``` sh
ln -s /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
```

For debian:

``` sh
timedatectl set-timezone Asia/Kolkata
```

### Install fonts in centos/linux:

System-wide : 

``` sh
mkdir -p /usr/share/fonts/greatvibes
```

User only : 

``` sh
mkdir ~/.fonts
```

Copy your font files in the appropriate folder and "register" them in the system with:

``` sh
fc-cache -f -v
```

### Linux date conversion (epoch to human readable)

Convert epoch time to human readable format:

``` sh
date -d @1445305686.222
```

### Howto add swap space:

``` sh
free
dd if=/dev/zero of=/var/swap.img bs=1024k count=1000
mkswap /var/swap.img
swapon /var/swap.img
free
```

### Disable firefox's verification of extension signing

`xpinstall.signatures.required` in `about:config`

### Firefox: open links in background tab always

-   Open a new tab, enter `about:config`
-   Search for browser.tabs.loadDivertedInBackground
-   Double click on '`false`' to set 'Value' to '`true`'
-   Go to NewsBlur and open a story with 'o' and see it load in the background

(from newsblur's Goodies page)

### If df shows no disk space even after deleting files, check this output:

``` sh
sudo /usr/sbin/lsof | grep deleted
```

-   Space will not be freed for the files there.
-   Restart those offending daemons to actually free the space up.

If you don't have lsof, just use this:

``` sh
find /proc/*/fd -ls | grep  '(deleted)'
```

### Useful linux diagnostic commands:

``` sh
uptime
dmesg | tail
vmstat 1
mpstat -P ALL 1
pidstat 1
iostat -xz 1
free -m
sar -n DEV 1
sar -n TCP,ETCP 1
top
```

### GNU/Screen scrollback:

`Ctrl a Esc`
(then use `Ctrl b/Ctrl f/Ctrl u/Ctrl d` etc)
and `Esc` to end

### Quick fsck (solaris)

``` sh
fsck -Fy ufs /dev/rdsk/c1d0s5
```

### Debian - clean up orphaned files:

``` sh
aptitude  remove --purge $(deborphan)
```

### See filesystem usage:

``` sh
/usr/bin/du --total --summarize --human-readable --one-file-system
```

### GNU/Screen splitting windows

-   `C-a V or C-a |`     split the screen vertically
-   `C-a X`              remove/detach the current split
-   `C-a S`              split horizontally
-   `C-a tab`            cycle between windows

### Tmux keybindings

-   `Ctrl-b %` (Split the window vertically)
-   `Ctrl-b :` "split-window" (Split window horizontally)
-   `Ctrl-b o` (Goto next pane)
-   `Ctrl-b q` (Show pane numbers, when the numbers show up type the key to goto that pane)
-   `Ctrl-b {` (Move the current pane left)
-   `Ctrl-b }` (Move the current pane right)

And here's my .tmux.conf

``` sh
set -g prefix C-a
unbind C-b
bind C-a send-prefix

set -g default-terminal "xterm-256color"

set -g history-limit 10000
set -g set-titles-string "#T"

unbind %
bind | split-window -h
bind - split-window -v
```

### Colour in terminals

``` sh
    arunsrin@ARUNSRIN-G2CA5 MINGW64 ~
    $ printf "\033[32mhi\033[0m"
    hi
```

-   `\033` is Escape
-   So `Escape + 3 + 2 + m` tells the terminal that everything from this
    point onwards is in green.
-   And `Escape + [ + 0 + m` reverts it back to normal

-   These are some sequences:

```
Sequence   What it Does
ESC[1m     Bold, intensify foreground
ESC[4m     Underscore
ESC[5m     Blink
ESC[7m     Reverse video
ESC[0m     All attributes off
```

### Bash Stty: Coredump etc

``` sh
Ctrl \
```

or

``` sh
kill -SIGQUIT <pid>
```

Override it with:

``` sh
stty quit <some-binding>
```

Similarly for that age-old backspace not deleting a character problem:

``` sh
stty erase ^h
```

To see the current terminal capabilities, run:

``` sh
stty -a
```

### Fix for xargs errors when filenames contain spaces

-   `find` has a print0 option that uses null characters instead of \n as separators.
-   `xargs` has a -0 option that uses the same separator when working on the args. So:

``` sh
find . -name -print0 | xargs -0 ls -l
```

### Bash faster navigation with cdpath

``` sh
export CDPATH=:$HOME:$HOME/projects:$HOME/code/beech
```

-   cd'ing to a folder first looks at CWD, then rest of CDPATH

### Find

with date filters

-   `find . -ctime -3` # created in the past 3 days
-   `find . -ctime +3` # older than 3 days
-   `find . -ctime 3` # created exactly 3 days back
-   `find . -ctime +3 -ctime -5` # created 3 - 5 days back
-   `find . -newer /tmp/somefile` # see somefile's timestamp and show files newer than it
-   works great in conjunction with:
-   `touch 0607090016 /tmp/somefile` #i.e. 7th june, 9:00 am, 2016
-   `find . -maxdepth 1 -type d -ctime +38 -exec rm -rf  {} \;` delete all folders older than 38 days back.
-   don't use atime much: every directory access changes its atime, so when find traverses through it, the inode's atime entry gets updated.

### File formatting, wrapping etc

Huh, who knew this existed:

``` sh
cat <some-verbose-output> | fold -70
```

-   `fold -s` folds at whitespace

-   Also look at the `fmt` command, which seems similar to emacs'
    `fill-paragraph`.

-   `pr` gives a pretty display with margins, headers, and page numbers.

### Deleting files with odd names

There's more than one way. Here's one: find the inode with `ls -i`, then delete with:

``` sh
find -inum <inode-number> -exec rm -i {} \;
```

### See whitespace with cat

Use this:

``` sh
cat -v -t -e <somefile>
```

-   `-e`: Add a trailing `$` at the end of a line.
-   `-t`: Show tabs as `^I`

### Stat command: see inode information

The inode holds the address in the filesystem, access permissions, ctime/mtime etc

``` sh
    arunsrin@ARUNSRIN-G2CA5 MINGW64 ~
    $ stat ntuser.ini
      File: ‘ntuser.ini’
      Size: 20              Blocks: 1          IO Block: 65536  regular file
    Device: a4b221d6h/2763137494d   Inode: 562949953421373  Links: 1
    Access: (0644/-rw-r--r--)  Uid: (1233064/arunsrin)   Gid: (1049089/ UNKNOWN)
    Access: 2015-07-21 18:57:13.142410100 +0530
    Modify: 2010-11-21 08:20:53.336035000 +0530
    Change: 2016-06-06 09:18:05.239486700 +0530
     Birth: 2015-07-21 18:57:13.142410100 +0530
    
    arunsrin@ARUNSRIN-G2CA5 MINGW64 ~
    $
```

If the filename is odd and you can't paste it easily in the terminal, just try

``` sh
ls -il
```

### Bash debugging

Run the script with `-xv` in the shebang:

``` sh
#!/bin/bash -xv
# do something
```

### Bash suppress echo (for reading passwords)

In bash, while reading input from the user, if you want to suppress
the echo on the screen (for sensitive inputs like passwords), do this:

``` sh
stty -echo
read SECRETPASSWD
stty echo
```

### ngrep

Try this:

``` sh
sudo ngrep -d any <word> -q
```

`-d any` listens on any interface

`-q` is quiet mode so those `#`'s don't show.

### Pretty-print json

``` sh
cat somefile.json | python -m json.tool
```

## Systemd

### Flush old logs in journalctl

By date or by size:

``` sh
    sudo journalctl --vacuum-time=2d
    sudo journalctl --vacuum-size=500M
```

### Tail journalctl

``` sh
journalctl -f
```

For a specific service:

``` sh
journalctl -u httpd -f
```

### Store logs on disk

(from <http://unix.stackexchange.com/questions/159221/how-display-log-messages-from-previous-boots-under-centos-7>)

On CentOS 7, you have to enable the persistent storage of log messages:

``` sh
# mkdir /var/log/journal
# systemd-tmpfiles --create --prefix /var/log/journal
# systemctl restart systemd-journald
```

Otherwise, the journal log messages are not retained between
boots. This is the default on Fedora 19+.

## Package management

### Sort RPMs by size

``` sh
rpm -qa --queryformat '%{size} %{name}\n' | sort -rn | more
```

### Extract rpm into current folder instead of installing:

``` sh
rpm2cpio boost-system-1.53.0-23.el7.x86_64.rpm | cpio -idmv
```

### Trace a binary or file to the RPM that installed it:

``` sh
yum whatprovides /usr/lib64/libdbus-c++-1.so.0
```

or this:

``` sh
rpm -qf /usr/lib64/libdbus-c++-1.so.0
```

### Yum/dnf revert

If a yum remove wiped out several packages, do this:

-   `dnf history` # note the id of the bad removal here
-   `dnf history undo 96`

yum/dnf will reinstall all the packages that were removed in that id.

### Dependencies of a package

This command shows what other packages need the queried package:

``` sh
repoquery --whatrequires libunwind
```

This command shows what other packages need to be installed for a queried package:

``` sh
yum deplist nginx
```

## Databases

### Postgreql quickstart

``` sql
sudo -i -u postgres
postgresql quickstart
createuser --interactive
createdb ttrssdb
psql
>alter user ttrssuser with encrypted password 'blah';
>grant all privileges on database ttrssdb to ttrssuser;
```

### MySql quick start

``` sql
mysql> create database habari;
Query OK, 1 row affected (0.02 sec)

mysql> grant all on habari.* to 'habariuser'@'localhost' identified by 'blah';
Query OK, 0 rows affected (0.06 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

### Sqlite basics:

``` sql
thaum ~/code/app$ sqlite perl.db
SQLite version 2.8.17
Enter ".help" for instructions
sqlite> .tables
sqlite> .schema
sqlite> create table perltest (id integer PRIMARY KEY,name varchar(10), salary integer);
sqlite> .tables
perltest
sqlite> .headers on
sqlite> .mode column
sqlite> select * from perltest;
sqlite> insert into perltest values(1,'arun',12345);
sqlite> insert into perltest values(2,'brun',23456);
sqlite> select * from perltest;
id          name        salary
----------  ----------  ----------
1           arun        12345
2           brun        23456
```

## Learnings/Notes

### Docker Notes:

-   apache mesos: get a lot of compute clusters looking like a single system.
-   Docker Trusted Registry: on-prem repository service
-   Machine: configures docker on cloud instances
-   Swarm: deploys containers in clusters. (Docker's version of Kubernetes)
-   Compose: use YAML templates ofr multiple application deployments.
-   Tutum - like compose for cloud deployment. New acquisition.
-   OpenStack Havana supports docker as a hypervisor.
-   `docker run -d` (detaches and runs as a daemon)
-   use `docker start -i asdasdas123 bash` to connect to an existing
    instance. (or actually attach).
-   use `docker exec` if you want another process in an existing
    container. better than attach since attach just reattaches to the
    original pid1 process.
-   `docker rename` renames an existing container. otherwise `--name` while starting.
-   `docker ps -a` shows non-running containers.
-   names are auto-generated if you don't specify them :)
-   =docker run &#x2013;name loopdate -d centos /bin/sh -c "while true; do date; sleep 3; done"=
-   (daemonize example)
-   `docker logs  --tail 0 -f loopdate`
-   (to see the live logs for the example above)
-   `docker cp /etc/hostname asdasd123132:/tmp`
-   `docker run --restart <etc>`: sets a policy to restart if it
    stops. doesn't start a new container, just restarts the same id.
-   NUMA - Non-Uniform Memory Access.
-   `/var/lib/docker/containers/<id>`
-   `/var/lib/docker/aufs/diff/<id>`: see the CopyOnWrite diffs between this instance and the base layers.
-   `docker diff <id>`: shows files changed in a container.
-   `docker inspect loopdate|less` : json metadata, e.g. ipaddress.
-   `docker history <image>` shows the history of commands used to build that image.
-   'latest' is a convention but need not be latest.. e.g. ubuntu sets
    'latest' to their LTS release 14.04, and not to bleeding edge.
-   creating images: either 'commit' an existing container, or specify a dockerfile.
-   you can save and package to tar file instead of pushing to a registry.
-   `docker images -a`: show intermediate images (these don't have tags)
-   `` docker rm `docker ps --no-trunc -aq` `` (remove everything)
-   sample commit command:
    `docker commit --change 'CMD ["/usr/sbin/httpd","-D","FOREGROUND"]'  --change 'ENV APACHE_RUN_USER www-data'  --change 'ENV APACHE_RUN_GROUP www-data' 26cb lab/websvr:v0.2`
-   do a `docker pull <image>` before use if you want to speed up your boxes.
-   docker registry is opensource, and v1.6+ is in go and supports parallel downloads.
-   registry:latest is 0.9, and is a python app. deprecated.
-   `docker run -p 5000:5000 -d registry:2` &#x2013;gives a web interface for registry v2.
-   `docker tag arun/myapache localhost:5000/myapache`, followed by a
    `push`: pushes myapache to the local registry.
-   `docker save/load`: tar a repo (i.e. image), including parent layers
    and tags and versions, for local circulation.
-   `docker export` is like save, but flattens the filesystem.
-   build a docker image from a dockerfile: docker build some/path
-   use `--link` to link two containers together (adds to each container's
    hosts file). newer versions have advanced networking: put associated
    containers in a single subnet , and allow them to talk to each
    other.

### Vagrant notes:

#### setup:

-   `vagrant init`
-   `vagrant box add centos/7`
-   mention the same box in the vagrantfile

#### start:

-   `vagrant up`
-   `vagrant ssh`

#### stop:

-   `vagrant suspend` # save state and stop
-   `vagrant halt` # graceful shutdown
-   `vagrant destroy` # wipe out hd etc

### Ansible notes

-   Modules are wrappers for administration commands (like ping, apt, yum, copy, etc).
-   Always use these instead of shell exec since modules are idempotent:
    you specify the state you want to be in, and the commands are run
    appropriately.
-   A task contains a module to be run, along with Facts or conditions or anything else.
-   Handlers can do everything tasks can, and are triggered by tasks
    when conditions are met. e.g. 'start nginx' would be a handler
    called in 'install nginx'.
-   Roles organize multiple tasks in one coherent whole (e.g. installing
    nginx may require adding a repo, copying certs, installing the rpm
    and starting the server).
-   Roles are organized like this: files, handlers, meta, templates, tasks, vars.
-   Except files and templates, a main.yml file present in all other
    folders will be executed automatically.
-   Files have static files, e.g. httpd.conf, certs etc.
-   Handlers have triggers obviously
-   Meta has dependencies and other metadata. e.g. run the ssl role
    before starting the nginx role.
-   Templates are based on jinja2.
-   Variables have vars that are used to fill the templates.
-   Tasks have the main logic.
-   To run the whole role, just call the main yaml: `ansible-playbook -s main.yml`
-   Facts are metadata gathered by ansible on init: num<sub>processors</sub>,
    cores, interfaces, mounts etc. you can use these vars in your
    templates.
-   ansible-vault can be used to encrypt vars and files in a role.

### Linux ad-hoc daemonization

-   If a script is running in a terminal and you want to daemonize it, do this:
-   `Ctrl-Z` to suspend it
-   `bg` to make it a background job
-   `disown -h %job-id` where `job-id` is what bg returned. This removes
    the command from the shell's job list, so it won't get a SIGHUP when
    the terminal closes.

### linux ctime vs mtime

-   ctime is for inode, mtime is for contents
-   e.g. chmod changes ctime. `echo "asd">>file` changes mtime.

### soft vs hard links

#### Hard links:

-   Two filenames in a folder pointing to the exact same inode.
-   There is no distinction between the link and the original.
-   This means you can delete one file and the other will still exist!
-   Cannot traverse filesystems. cannot hard link directories

#### Soft links:

-   A new kind of file that has its own inode entry. the OS knows how to
    traverse from it to the parent.
-   No limitations.

-   When a user runs mkdir, along with creating a directory, mkdir
    internally creates a hard-link called '..' pointing to the
    parent. that's why cd .. takes you to the parent, and that way '..'
    doesn't take up space in the filesystem either. Similarly another
    hardlink called '.' is created inside that folder, linking to the
    folder itself in the parent.

i.e. if you have test/child:

``` sh
cd child
ls -ail
.   inode1  # child's inode
..  inode2  # parent's inode
cd ..
ls -ail
. inode2   # parent's inode
.. inode4  # parent's parent's inode
child inode1
```
