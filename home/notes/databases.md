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

### Intermediate operations

/Operators/ are used with other clauses like `SELECT` and `WHERE`. Examples:

- Comparison operators like `=`, `>`, `<=` or `<>`
- Logical operators: `BETWEEN`, `IN`, `LIKE`, `AND`, `OR`
- Arithmetic operators like `+`, `-`, `/`, `*` and `%`

```sql
SELECT
	Total AS [Original Amount],
	Total + 10 AS [Addition example],
	Total - 10 AS [Subtraction example]
FROM
	invoices
ORDER BY
	Total DESC;
```

#### Filtering with `WHERE`:

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE Total = 1.98
ORDER BY InvoiceDate;
```

`WHERE` always comes after the `FROM` but before the `ORDER BY`.

`BETWEEN` gives a range, e.g. `WHERE Total BETWEEN 1.98 AND 5.00`

#### Searching in text:

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE BillingCity IN ('Tucson', 'Paris', 'London')
ORDER BY Total
```

#### Wildcard search with LIKE

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE BillingCity LIKE 'T%'
ORDER BY Total
```

(You can do a `NOT LIKE 'T%'` to invert the results)

#### Filtering by date

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE InvoiceDate = '2009-01-03 00:00:00'
ORDER BY Total
```

#### Something more interesting:

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE InvoiceDate BETWEEN '2009-01-01 00:00:00' AND '2009-12-31 23:59:59'
ORDER BY InvoiceDate
```

#### Using the Date() function

Let's you skip the time, for instance.

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE DATE(InvoiceDate) = '2009-01-03'
ORDER BY Total
```

#### Multiple AND/OR:

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE BillingCity LIKE 'p%' OR BillingCity LIKE 'd%'
ORDER BY Total
```

#### Specifying order:

```sql
SELECT InvoiceDate, BillingAddress, BillingCity, Total
FROM invoices
WHERE Total > 1.98 AND (BillingCity LIKE 'p%' OR
	BillingCity LIKE 'd%')
ORDER BY Total
```

#### The CASE operator

Lets you create a new, temporary field based on some conditions.

```sql
SELECT
	InvoiceDate,
	BillingAddress,
	BillingCity,
	Total,
	CASE
	WHEN TOTAL < 2.00 THEN 'Baseline Purchase'
	WHEN TOTAL BETWEEN 2.00 AND 6.99 THEN 'Low Purchase'
	WHEN TOTAL BETWEEN 7.00 AND 15.00 THEN 'Target Purchase'
	ELSE 'Top Performers'
	END AS PurchaseType
FROM
	invoices
ORDER BY
	BillingCity
```

- Wrapped with `CASE` and `END`
- Alias using `AS` to create the new label
- `WHEN` and `ELSE` to specify the conditions

Now to filter only top performers in the above case, it is trivial to add a
`WHERE PurchaseType = 'Top Performers'` to the query.

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

