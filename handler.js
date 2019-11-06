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

