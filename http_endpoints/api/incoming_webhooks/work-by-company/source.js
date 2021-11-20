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
          '$switch': {
            'branches': [
              {
                'case': {
                  '$eq': [
                    {
                      '$ifNull': [
                        '$endDate', null
                      ]
                    }, null
                  ]
                }, 
                'then': '$$NOW'
              }, {
                'case': {
                  '$ne': [
                    '$endDate', null
                  ]
                }, 
                'then': {
                  '$toDate': '$endDate'
                }
              }
            ], 
            'default': '$endDate'
          }
        }, 
        'startDate': {
          '$toDate': '$startDate'
        }, 
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
            'endDate': '$endDate', 
            'startDate': '$startDate', 
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
      '$project': {
        'company': '$company', 
        'combinedHighlights': '$combinedHighlights', 
        'companyEndDate': {
          '$dateToString': {
            'format': '%Y-%m-%d', 
            'date': '$companyEndDate'
          }
        }, 
        'companyStartDate': {
          '$dateToString': {
            'format': '%Y-%m-%d', 
            'date': '$companyStartDate'
          }
        }, 
        'positions': {
          '$map': {
            'input': '$positions', 
            'as': 'positions', 
            'in': {
              'position': '$$positions.position', 
              'endDate': {
                '$dateToString': {
                  'format': '%Y-%m-%d', 
                  'date': '$$positions.endDate'
                }
              }, 
              'startDate': {
                '$dateToString': {
                  'format': '%Y-%m-%d', 
                  'date': '$$positions.startDate'
                }
              }, 
              'location': '$$positions.location'
            }
          }
        }
      }
    }
  ];

 const work = await mycollection.aggregate(pipeline).toArray();

 return work;

};