GET _cat/indices
GET _cat/indices?v&pretty

# add new record(document) in 'product' index
POST product/_doc/100
{ "title": "MSI Steath 15", "description": "This is a MSI workstation", "quantity": 4, "price": 25999.99 }

# add new record(document) in 'product' index
POST product/_doc/101
{ "title": "AlienWare A-11", "description": "This is a AlienWare workstation", "quantity": 4, "price": 14959.99 }


# update record(document) in 'product' index with specific '_id', ex: id="100"
POST product/_doc/101
{ "title": "AlienWare A-V2", "description": "AlienWare workstation-101", "quantity": 10, "price": 14959.99 }

# add multi-records(documents) in 'product' index
POST _bulk
{ "index" : { "_index" : "product", "_id": 102 } }
{ "title": "Dell Laptop", "description": "This is a dell laptop game", "quantity": 11, "price": 12000.50 }
{ "index" : { "_index" : "product", "_id": 103 } }
{ "title": "HP Laptop", "description": "This is a HP laptop game", "quantity": 5, "price": 10500 }

GET product

# Search all products
GET product/_search

GET /_all/_search?q=title:a*

GET product/_search
{
  "query": {
    "match": {
      "_id": "101"
    }
  }
}

GET product/_count
GET product/_mapping
GET product/_settings

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

POST _bulk
{ "index" : { "_index" : "person" } }
{ "first_name" : "Nabil", "last_name": "Gayl", "age": 40.5 }
{ "index" : { "_index" : "person" } }
{ "first_name" : "Imane", "last_name": "Salhi", "age": 26 }

POST person/_doc/1
{ "first_name" : "Yousra", "last_name": "Gayl", "age": 3 }

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
        "type" : "double"
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

GET person_alias/_mapping
GET person_alias/_search

