# Systemd

## Flush old logs in journalctl

By date or by size:

``` sh
    sudo journalctl --vacuum-time=2d
    sudo journalctl --vacuum-size=500M
```

## Tail journalctl

``` sh
journalctl -f
```

For a specific service:

``` sh
journalctl -u httpd -f
```

## Store logs on disk

(from <http://unix.stackexchange.com/questions/159221/how-display-log-messages-from-previous-boots-under-centos-7>)

On CentOS 7, you have to enable the persistent storage of log messages:

``` sh
# mkdir /var/log/journal
# systemd-tmpfiles --create --prefix /var/log/journal
# systemctl restart systemd-journald
```

Otherwise, the journal log messages are not retained between
boots. This is the default on Fedora 19+.

