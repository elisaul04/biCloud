'use strict';
const aws = require('aws-sdk')
const db = new  aws.DynamoDB.DocumentClient();
const uuid = require('uuid/v4')
const postTable = process.env.POST_TABLE
 
function response(statusCode, message){
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}
module.exports.createPost = (event,context,callback)=>{
  const body = JSON.parse(event.body)

  const post = {
    id : uuid(),
    createAdd: new Date().toISOString(),
    userId: 1,
    title: body.title,
    body:body.body
  }

  return db.put({
    TableName:postTable,
    Item:post
  }).promise().then(()=>{
    callback(null,response(201,post))
  }).catch(error=> response(null,response(error.statusCode,error)))
}

//get All post
module.exports.getAllPost = (event,context,callback) => {
   return db.scan({
    TableName:postTable
   }).promise().then(res=>{
     callback(null, response(200,res.Items))
   }).catch(error=> response(null,response(error.statusCode,error)))
}

module.exports.getPosts = (event,context,callback) =>{
  const number = event.pathParameters.number;
  const params= {
    TableName:postTable,
    Limit:number
  };
  return db.scan(params).promise().then(res=>{
    callback(null, response(200,res.Items))
  }).catch(error=> response(null,response(error.statusCode,error)))
}

module.exports.getPost = (event,context,callback)=>{
const id = event.pathParameters.id;
  const params = {
    key:{
      id:id
    },
    TableName:postTable
  }
  return db.get(params).promise().then(res=>{
    if(res.Item)callback(null,response(200,res.item))
    else callback(null,response(404,{error: 'post not found'}))
  })
   .catch(error=> response(null,response(error.statusCode,error)))
}

// module.exports.updatePost= (event, context, callback) =>{
//   const id = event.pathParameter.id;
//   const body = JSON.params(event.body);
//   const paramName = body.paramName;
//   const paramValue = body.paramValue;

//   const params = {
//     key:{
//       id:id
//     },
//     TableName : postTable,
//     ConditionExpression:'atrribute_exits(id)'
//   }
// }