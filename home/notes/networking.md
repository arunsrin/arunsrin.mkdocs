# Networking

## iperf

This link is quite nice: https://www.golinuxcloud.com/linux-monitor-network-traffic/

How to use iperf:

Whitelist port 5201 on your security group and firewall.

Then start the server first:

`iperf3 -i 5 -s`

Then the client:

`iperf3 -i 5 -t 60 -c <IP/hostname of the server>`

It gives a nice report but apparently isn’t good for latency checks, only
bandwidth.

## UDP Client

From [PyMOTW](https://pymotw.com/2/socket/udp.html) :

``` python
import socket
import sys

# Create a UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

server_address = ('192.168.0.100', 8080)
message = 'This is the message.  It will be repeated.'

try:

    # Send data
    print >>sys.stderr, 'sending "%s"' % message
    sent = sock.sendto(message, server_address)

    # Receive response
    print >>sys.stderr, 'waiting to receive'
    data, server = sock.recvfrom(4096)
    print >>sys.stderr, 'received "%s"' % data

finally:
    print >>sys.stderr, 'closing socket'
    sock.close()
```

## UDP Server

From [PyMOTW](https://pymotw.com/2/socket/udp.html) :

``` python
import socket
import sys

# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Bind the socket to the port
server_address = ('localhost', 10000)
print >>sys.stderr, 'starting up on %s port %s' % server_address
sock.bind(server_address)
while True:
    print >>sys.stderr, '\nwaiting to receive message'
    data, address = sock.recvfrom(4096)
    
    print >>sys.stderr, 'received %s bytes from %s' % (len(data), address)
    print >>sys.stderr, data
    
    if data:
        sent = sock.sendto(data, address)
        print >>sys.stderr, 'sent %s bytes back to %s' % (sent, address)

```

## Curl tips

-   Show headers with `-I` and change request type with `-X`. e.g.

``` sh
curl -I -X DELETE  http://localhost/blah
```

-   To add a header in the outgoing request, use `-H`:

``` sh
curl --header "X-MyHeader: 123" www.google.com
```

-   Follow redirects with `-l`
-   Disable security check with `-k`

- Send content with `-d`:

``` sh
curl -X POST --header "Content-Type: application/json" -d '{"test": true}' http://localhost/blah
```

## If more than 10 telnet sessions to a server fail

`per_source = 10`
in `/etc/xinetd.d/telnet` or `/etc/xinetd.conf`

## Start xinetd with debugs turned on

``` sh
/usr/sbin/xinetd -f /etc/xinetd.conf -d
```

## Check duplicate ip with arping

``` sh
bash-4.2 ~$ arping 192.168.0.58 -D -c 3 -I ens32
ARPING 192.168.0.58 from 0.0.0.0 ens32
Unicast reply from 192.168.0.58 [18:E7:28:2E:92:9C]  1.747ms
Sent 1 probes (1 broadcast(s))
Received 1 response(s)
bash-4.2 ~$ echo $?
1
bash-4.2 ~$
```

-   exit status of 0 confirms a duplicate ip

## Test tcp connections with nc

(from <http://unix.stackexchange.com/questions/73767/how-to-check-whether-firewall-opened-for-a-port-but-not-listening-on-the-port>)

``` sh
nc -vz targetServer portNum
```

For example:

``` sh
bash-3.2 ~$ nc -vz erdos 22
Connection to erdos 22 port [tcp/ssh] succeeded!
bash-3.2 ~$
```

## Force NTP sync

``` sh
sudo systemctl stop ntpd
sudo ntpdate -s time.nist.gov
sudo systemctl start ntpd
```
