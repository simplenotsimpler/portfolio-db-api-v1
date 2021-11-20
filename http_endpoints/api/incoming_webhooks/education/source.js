exports = function(payload) {
   const mongodb = context.services.get("mongodb-atlas");
   const mycollection = mongodb.db("portfolio").collection("education");
   const query = {};
   const projection = { "_id": 0 };
   return mycollection.find(query, projection).toArray();
};