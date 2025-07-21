GET _cat/indices
GET _cat/indices?v&pretty

# add new record(document) in 'product' index
POST product/_doc/100
{ "title": "X-MSI Steath 15", "description": "This is a MSI workstation", "quantity": 4, "price": 25999.99, "computer_type": "Laptop", "created_at": "11/12/2022" }

# add new record(document) in 'product' index
POST product/_doc/101
{ "title": "AlienWare A-11", "description": "This is a AlienWare workstation", "quantity": 4, "price": 14959.99, "computer_type": "Desktop", "created_at": "05/25/2023" }


# update record(document) in 'product' index with specific '_id', ex: id="100"
POST product/_doc/101
{ "title": "AlienWare A-V2", "description": "AlienWare workstation-101", "quantity": 10, "price": 14959.99, "computer_type": "Desktop" }

# add multi-records(documents) in 'product' index
POST _bulk
{ "index" : { "_index" : "product", "_id": 102 } }
{ "title": "Dell G15", "description": "This is a dell laptop game", "quantity": 11, "price": 12000.50, "computer_type": "Laptop" }
{ "index" : { "_index" : "product", "_id": 103 } }
{ "title": "HP S33", "description": "This is a HP Desktop game", "quantity": 5, "price": 10500, "computer_type": "Desktop" }
{ "index" : { "_index" : "product", "_id": 104 } }
{ "title": "AlienWare workstaion C-33", "description": "AlienWare workstation-C33", "quantity": 25, "price": 35000.99, "computer_type": "Laptop" }


GET product/_count
GET product/_mapping
GET product/_settings

GET product

# Search all products
GET product/_search

GET /_all/_search?q=title:a*

GET product/_search
{
  "size": 20, 
  "from": 0, 
  "query": {
    "match_phrase": {
      "description": "This is a dell"
    }
  }
}

# Query DSL= Domain Specific Langauge
# slop is distance between words in query.
## example query = "This laptop", slop =4; it means "This 1st_word 2nd_word 3rd_word 4th_word laptop"
GET product/_search
{
  "size": 20, 
  "from": 0, 
  "query": {
    "match_phrase": {
      "description": {
        "query": "This laptop",
        "slop": 4 
      }
    }
  }
}

# search using 'query_string' with:
## default_field
## query
## default_operator
GET product/_search
{
  "query": {
    "query_string": {
      "default_field": "title",
      "query": "msi hp",
      "default_operator": "OR"
    }
  }
}

# search using 'query_string' with:
## fields: list of field
## query
## default_operator
GET product/_search
{
  "query": {
    "query_string": {
      "fields": ["title", "description"],
      "query": "game dell",
      "default_operator": "AND"
    }
  }
}

# sorting product ASC/DESC with FIELD.keywords
# '_source' = ["FILEDS"], show a specific fields
GET product/_search
{
  "size": 20, 
  "from": 0, 
  "query": {
    "query_string": {
      "default_field": "title",
      "query": "*"
    }
  },
    "sort": [
    {
      "title.keyword": {
        "order": "desc"
      }
    }
  ],
  "_source": ["title", "quantity"]
}

# search using 'query' with:
## bool
## must
## match field
## query_string with default field and query
# sorting product ASC/DESC with FIELD.keywords
# '_source' = ["FILEDS"], show a specific fields
GET product/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "computer_type": "laptop"
          }
        },
        {
          "query_string": {
            "default_field": "title",
            "query": "*",
            "default_operator": "OR"
          }
        }
      ]
    }
  },
    "sort": [
    {
      "title.keyword": {
        "order": "asc"
      }
    }
  ],
  "_source": ["title", "quantity", "computer_type"]
}


# search using 'query' with:
## bool
## must
## Term or Terms
## query_string with default field and query
# sorting product ASC/DESC with FIELD.keywords
# '_source' = ["FILEDS"], show a specific fields
# search with 'FIELD.keywords' means should respect the cases but with 'FIELD' only means Ignore case
GET product/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "terms": {
            "computer_type.keyword": [
              "Laptop"
            ]
          }
        },
        {
          "query_string": {
            "default_field": "title",
            "query": "*",
            "default_operator": "OR"
          }
        }
      ]
    }
  },
    "sort": [
    {
      "title.keyword": {
        "order": "asc"
      }
    }
  ]
}

# Search with Range query
GET product/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 12000,
        "lte": 35000
      }
    }
  }
}


# update API: 1st method: update specific field value in "product" index
POST product/_doc/101/_update
{
  "script":{
    "source": "ctx._source.price=params.value",
    "lang": "painless",
    "params": {
      "value": 12700.50
    }
  }
}

# 2nd method: update specific field value in "product" index
POST product/_doc/101/_update
{
  "doc":{
      "price": 32399.50
  }
}

# delete "product" index
DELETE product



#-------------------------------------------------------------
# create 'person' index and add a bunch of data
POST _bulk
{ "index" : { "_index" : "person" } }
{ "first_name" : "Nabil", "last_name": "Gayl", "age": 40.5 }
{ "index" : { "_index" : "person" } }
{ "first_name" : "Imane", "last_name": "Salhi", "age": 26 }

POST person/_doc/1
{ "first_name" : "Yousra", "last_name": "Gayl", "age": "3" }

# search all people
GET person/_search

# GET all fields
GET person/_mapping

GET person/_alias

# search with specific field
GET person/_search
{
  "query": {
    "match": {
      "last_name": "salhi"
    }
  }
}

# update API:
POST person/_update_by_query
{
  "query": {
    "match": {
      "first_name": "yousra"
    }
  },
  "script":{
    "source": "ctx._source.age=params.value",
    "lang": "painless",
    "params": {
      "value": 3.5
    }
  }
}

# delete "person" index
DELETE person
# delete specific document in "person" index, ex: "_id"="1"
DELETE person/_doc/1

PUT person_v2
{
  "mappings" : {
    "properties" : {
      "age" : {
        "type" : "double",
        "fields":
        {
          "text":{
          "type": "text"
          }
        }
      },
      "first_name" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "last_name" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      }
    }
  }
  
}


# delete "person" index
DELETE person_v2

# reindex
POST /_reindex
{
  "source": {
    "index": "person"
  },
  "dest": {
    "index": "person_v2"
  }
}

POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "person",
        "alias": "person_alias"
      } 
    },
    {
      "add": {
        "index": "person_v2",
        "alias": "person_alias"
      }
    }
  ]
}
GET person/_mapping

GET person_alias/_mapping
GET person_alias/_search