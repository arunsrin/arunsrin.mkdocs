# AWS

Most of this is from *Amazon Web Services in Action, IInd edition*.

## CloudFormation

Use CloudFormation to create a wordpress infra using these services:

- ELB - ALB specifically
- EC2 - Let's try 2 instances
- RDS - For MySql
- EFS - Using NFSv4.1 for User uploads
- Security Groups - Firewall

Full yaml written by the authors is [here](https://s3.amazonaws.com/awsinaction-code2/chapter02/template.yaml).

Well that was fast. The template file externalizes the keypair so you can put
your own from the drop down.

```yaml
Parameters:
  KeyName:
    Description: 'Key Pair name'
    Type: 'AWS::EC2::KeyPair::KeyName'
    Default: mykey
```

It adds an SG under `WebServerSecurityGroup` for ports 22 and 80.

There's a `LaunchConfiguration` section that's a bit like cloud-init (?), they
specify the conf files here for apache/php, download the wordpress tgz and
untar, etc.

Also a mount command is run there to mount the EFS that is also created and
made available to this deployment.

The `Database` section creates the RDS micro instance.

Looks like you can refer to other blocks in the file like this: `GatewayId:
!Ref InternetGateway`. And can even run some sort of queries on top:
`AvailabilityZone: !Select [1, !GetAZs '']`.

As `ASG` is also created and it sets current count to 4.
