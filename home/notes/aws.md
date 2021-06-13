# AWS

Most of this is from *Amazon Web Services in Action, IInd edition*.

# CloudFormation

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

# EC2

## Instance Families

To decode the naming convention e.g. `t2.micro`:

- T - Cheap. Burst to higher perf for short periods.
- M - General Purpose
- C - Compute optimized
- R - Memory optimized
- D - Storage optimized, huge HDD
- I - Storage optimized, huge SSD
- X - Huge capacity, focus on memory, up to 1952 GB Mem and 128 virtual cores
- F - Accelerated computing based on FPGAs
- P,G and CG - Accelerated computing based on GPUs

The second part of the name, the `2` in `t2`, refers to the
generation. So this is the 2nd generation of the T family, of
size `micro`.

!!!note
    Stopped VMs incur no charges (unless you have attached resources like storage)
  
## EIPs

EIPs (elastic IPs) give you a fixed IP that you can associate to an EC2
instance. Otherwise the IP is going to change across reboots.

Seems very straightforward actually, create an EIP and you can associate to an
instance or a specific interface.

You can also create a new Network Interface, attach it to the instance, and
attach another EIP to that interface.

## Spot / Reserved instances

Spot: You bid for unused capacity in a DC. Price based on supply and demand.

Reserved: Use if you need VMs for a year or longer. Pay for a given time frame,
and get a discount. You pay even if you don't use it.

- No upfront, 1 year term
- Partial upfront, 1 or 3 year term
- All upfront, 1 or 3 year term

Potential savings may go up to 60%. You can also make scheduled reservations,
e.g. every week day from 9 AM to 5PM.

For spot instances, you set a bidding price. If the current spot price is lower
than your bid, an instance is spun up and your job runs. If the spot price then
exceeds your price, your VM is *terminated*. Good for batch processing jobs.

# Programming: CLI, SDK, CloudFormation

## Setup IAM first

IAM -> Add User -> 

- Name: *my-cli*
- Access type: `Programmatic`
- Permissions: Attach Existing Policies Directly
  - `AdministratorAccess` gives us everything

Then copy the access ID and key over somewhere safe.

Run `aws configure` to set things up.

```bash
 aws configure
 AWS Access Key ID [None]: <redacted>
 AWS Secret Access Key [None]: <redacted>
 Default region name [None]: us-east-1
 Default output format [None]: json
 ~
```

## Some CLI commands to try

This is pretty much like the `openstack` CLI.

- `aws ec2 describe-regions`
- `aws ec2 describe-instances --filters "Name=instance-type,Values=t2.micro"` - Using some filters

There is a `--query` arg that uses *JMESPath*, e.g.

- `aws ec2 describe-images --query "Images[0].ImageId"`

## SDK

Similarly, you can use the SDK for better control. e.g. `ec2.describeImages({ ... })`

## Blueprints / CloudFormation

Covered above already in brief. Contains:

- Format version
- Description
- Parameters - These are things you can set in the UI via drop-down etc, like ssh keys, AZ names, SG, etc
  - You can also set default values, remove echo (for sensitive text), specify allowed values and so on.
- Resources - instances, network, LB, EIP etc
- Outputs - return something from the template, like the generated hostname
  - Use `!GetAtt` for this. e.g. `!GetAtt 'Server.PublicDnsName'`

## Updates

Normally if you want to increase CPU/Mem, you'd have to power down, edit
settings, power back up. CF makes it all declarative. In this case, change the
`InstanceType` and redeploy, and it will figure out what to do.

## Template vs Stack

If you run a template to create a certain infrastructure, it's called a stack.
Think of template as a class and stack as the object instantiated by it.

# References

- [Cloudformation templates](https://github.com/widdix/aws-cf-templates)
- [AWS quick starts](https://aws.amazon.com/quickstart/?solutions-all.sort-by=item.additionalFields.sortDate&solutions-all.sort-order=desc&awsf.filter-tech-category=*all&awsf.filter-industry=*all&awsf.filter-content-type=*all)

