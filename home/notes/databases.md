# Databases

## Notes from "SQL QuickStart Guide"

Author: Walter Shields

### Basic operations

```sql
-- Single line comment
/* Multi 
Line
Comment */
SELECT FirstName, LastName, Email, City from customers;
```

Once more, using aliases:

```sql
SELECT FirstName AS "First Name", LastName AS "Surname", Email, City
from customers;
```

And again, with sorting:

```sql
SELECT FirstName AS "First Name", LastName AS "Surname", Email, City
from customers
ORDER BY Surname DESC;
```

Show only first 10 records: use the keyword `LIMIT`.


## Cassandra quickstart

I'm actually using ScyllaDB which is compatible with Cassandra.

`cqlsh` is it's shell.

``` sql
DESCRIBE keyspaces;
USE <name-of-keyspace>;
DESCRIBE tables;
SELECT * FROM <name-of-table>;
```

## Postgreql quickstart

``` sql
sudo -i -u postgres
postgresql quickstart
createuser --interactive
createdb ttrssdb
psql
>alter user ttrssuser with encrypted password 'blah';
>grant all privileges on database ttrssdb to ttrssuser;
```

## MySql quick start

``` sql
mysql> create database habari;
Query OK, 1 row affected (0.02 sec)

mysql> grant all on habari.* to 'habariuser'@'localhost' identified by 'blah';
Query OK, 0 rows affected (0.06 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

## Sqlite basics:

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

