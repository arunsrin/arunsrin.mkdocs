# Elastic Stack

These are notes from *Learning Elastic Stack 7.0*, by Pranav Shukla
and Sharath Kumar MN.

## Using the Kibana Console

Some simple APIs to warm up.

- `GET /` <- Prints version information
- `GET <index-name>/_mappings` <- schema/mappings of this index
- `GET <index-name>/_doc/<id_of_document>` <- Content of this document

# Fundamentals

An `Index` is loosely analogous to a table, and a document to a
record.  One Index can have only one `Type`.

`Types` are logical groupings same/similar documents in an
`Index`. e.g.  Employees could be one Type and Orders could be
another, even if both were json documents and both had several common
fields.

`Documents`: basic unit of information. Contains multiple fields like
date, logMessage, processName, etc. Internal fields that Elastic
itself maintains: `_id` (unique identifier), `_type` (Document's type,
e.g. _doc), `_index` (Index name where it is stored)

`Nodes` form together to form a `cluster`.

## Shards and Replicas

One can shard an index so that it is split into multiple segments,
which will then reside on 1 or more nodes. By default 5 shards are
made for every index. But if a node were to go down, those shards
would be lost. So you can also create one replica for each shard,
which will again be distributed in a slightly different order on the
same nodes. Execution of queries is transparently distribute to either
the primary or the replica shards.

## Core DataTypes

- String datatypes: 
	- `text` - general lengthy text, elastic can do full-text search on this
	- `keyword` - let's you run some analytics on string fields, i.e. something you want to sort, filter, aggregate
- Numeric datatypes:
	- `byte`/`short`/`integer`/`long`
	- `float`/`double`
	- `half_float`
	- `scaled_float`
- `date` datatype
- `boolean` datatype
- `binary` datatype - arbitrary binary content, base64-encoded
- Range datatypes: `integer_range`, `float_range`, `long_range`, `double_range`, `date_range`

## Complex DataTypes
- `array` - no mixing, list of same types
- `object` - allows inner objects within json documents
- `nested` - arrays of inner objects, where each inner object needs to be independently queriable

## Other DataTypes
- `geo-point` datatype - stores geo-points as lat and long
- `geo-shape` datatype - store geometric shapes like polygons, maps, etc. Allows queries that search within a shape
- `ip` datatype - ipv4/ipv6

## Indexes

Check `GET <index-name>/_mappings` in the dev console to see the
fields and their types in this index.

You will see stuff like this:

```json
        "file" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
```

What this means is, `file` is a field of type `text`, but it's also
mapped as a `keyword` so you can also do analytics on it.

An *Inverted Index* is built from all fields.

## CRUD APIs

An *indexing operation* is basically the addition of a document to the
index. Elastic parses all the fields and builds the inverted index.

Use the `PUT` API to do this, with or without an id.

Get it with this:

`GET <index-name>/_doc/<id of document>`

You can call an `UPDATE` with just a specific field (say, `price`) to
update that field in the document. Elastic will version and maintain
both copies. The `_version` field will be incremented.

You can set the field `doc_as_upsert` to `true` and call a POST to
`<index>/_update/<id>` to update if it exists or insert otherwise.

You can even do some scripting when you call the POST, using Elastic's
'painless' scripting language. e.g. to increment current value by 2.

`DELETE`: Call it on `<index>/_doc/<id>` as expected.

## Updating a mapping

In this example, the 'code' field is converted to a `keyword` type:

```json
PUT /catalog/_mapping
{
  "properties": {
    "code": {
      "type": "keyword"
    }
  }
}
```

# REST API overview

Main categories:

- Document APIs
- Search APIs
- Aggregation APIs
- Indexes APIs
- Cluster APIs
- cat APIs

For pretty printing while using curl, suffix `?pretty=true`. In the
Console UI, it's turned on by default.

## Searching

Use the `_search` API: 

```
GET /_search
```

This prints ALL docs in ALL indexes, first 10 results only though.


To search within an index:

```json
GET /<index-name>/_search
GET /<index-name>/_doc/_search
```

In earlier versions of elastic, an index could have more than one
type. In the above example, `_doc` is the type.

In Elastic 7.0, only one type is supported. So the second GET is
deprecated.

To search across more than one index:

```json
GET /catalog,my_index/_search
```

# Analytics and Visualizing Data

Elastic has *Analyzers* that break down values of a field into terms,
to make it searchable. This happens both during indexing and during
searching. Final goal is for the searchable index to be created.

Analyzers comprise of Character Filters, a Tokenizer, and Token
Filters.

*Character filters* map strings to something else, e.g. :) maps to
*_smile_*. They are run at the beginning of the processing chain in an
analyzer.

*Token Filters* are used for use cases like, removing stop words
(a/an/the), replacing everything to lowercase, etc.

Apart from the (default) Standard Analyzer, there are [many
others](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-analyzers.html).

To understand how the tokenization happens, here's an example:

```json
GET /_analyze
{
  "text" : "test analysis",
  "analyzer": "standard"
}
```

Output:

```json
{
  "tokens" : [
    {
      "token" : "test",
      "start_offset" : 0,
      "end_offset" : 4,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "analysis",
      "start_offset" : 5,
      "end_offset" : 13,
      "type" : "<ALPHANUM>",
      "position" : 1
    }
  ]
}
```

With different analyzers and filters, the final tokens would be
different.

## Term queries

You would use these in a search query to bypass the analysis stage and
directly lookup the inverted index. Other more complex queries use
these as a base.

Types of term queries:

- `range` query - e.g. to show all Products where the Price attibute
is >10 and <=20.
	- You can boost the weight of the results by suppplying a `boost`
      multipler.
	- You can query date ranges e.g. from `now-7d` to `now`.
- `exists` query - Just tell if the field exists or not.
- Term query - e.g do an exact match for a certain manufacturer in a
  Product index. Use the `keyword` type for this since keywords are
  not indexed. 
	  - You can get the keyword by querying `<fieldname>.raw`
- Terms query - Same as above, but you can give multiple terms to
  search for.
  
And a few others, see the full list of
[term-levelqueries](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html)
here.
  
`match` queries do the actual full-text searching. However if you
search in a keyword (like `datacenter.raw` which is a keyword field),
it skips all that and does an exact match.

You can set params for `fuzziness` in your search and it will return
results accordingly e.g. victer will match with victor.

# Kibana Query Language (KQL)

[KQL Guide](https://www.elastic.co/guide/en/kibana/7.15/kuery-query.html)

Recollect the Term Queries section above. You can search for all those
exact matches with `field:value`, e.g. `datacenter:sjc`.

OOh you can also do wildcard searches, like this: `host:nginx*` will
match all host fields with the value nginx01, nginx02, etc.


