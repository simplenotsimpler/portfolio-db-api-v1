exports = async function(payload) {
  const mongodb = context.services.get("mongodb-atlas");
  const mycollection = mongodb.db("portfolio").collection("work");
  const currentDate = new Date().toISOString().split('T')[0];

  const pipeline = 
  [
   {
     '$unwind': {
       'path': '$highlights', 
       'preserveNullAndEmptyArrays': true
     }
   }, {
     '$project': {
       'company': '$company', 
       'endDate': {
         '$ifNull': [
           '$endDate', {
             '$dateToString': {
               'format': '%Y-%m-%d', 
               'date': '$$NOW'
             }
           }
         ]
       }, 
       'startDate': '$startDate', 
       'website': '$website', 
       'location': '$location', 
       'position': '$position', 
       'highlights': '$highlights'
     }
   }, {
     '$group': {
       '_id': '$company', 
       'combinedHighlights': {
         '$push': '$highlights'
       }, 
       'positions': {
         '$addToSet': {
           'position': '$position', 
           'startDate': '$startDate', 
           'endDate': '$endDate', 
           'location': '$location'
         }
       }
     }
   }, {
     '$project': {
       '_id': 0, 
       'company': '$_id', 
       'combinedHighlights': '$combinedHighlights', 
       'companyEndDate': {
         '$max': '$positions.endDate'
       }, 
       'companyStartDate': {
         '$min': '$positions.endDate'
       }, 
       'positions': '$positions'
     }
   }, {
     '$sort': {
       'positions.endDate': -1
     }
   }
 ];

 const work = await mycollection.aggregate(pipeline).toArray();

 //replace companyEndDate with present if current date
 work.forEach((el) => {     
   if(el.companyEndDate === currentDate){
     el.companyEndDate = 'Present';
   }
 });

   
 // replace position end dates w/ present if today's date
 work.forEach((el)=>{
   el.positions.forEach((position)=> {
     if(position.endDate === currentDate){
       position.endDate = 'Present';
     }
     if(position.endDate === el.companyEndDate){
       el.location = position.location;
     }
   })
 });

 return work;

};