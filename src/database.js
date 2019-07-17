
const config = require('./config');

const isLambda = require('is-lambda');
const AWS = require('aws-sdk');

if (!isLambda) {
    AWS.config.update(
        {
            region: config.custom.DynamoDb.awsConfig.region,
            accessKeyId: config.custom.DynamoDb.awsConfig.accessKeyId,
            secretAccessKey: config.custom.DynamoDb.awsConfig.secretAccessKey,
        }
    );
}

module.exports = {

    submitScore: function(playerId, score) {
        return new Promise(async (resolve, reject) => {
            try {
                const docClient = new AWS.DynamoDB.DocumentClient();
                const parameters = {
                    Item: {
                    id: playerId,
                    score: score,
                    }, 
                    // ReturnConsumedCapacity: "TOTAL", 
                    TableName : config.custom.DynamoDb.tableName,
                };
                docClient.put(
                    parameters,
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            } catch (e) {
                console.log(`Error: ${JSON.stringify(e, null, 4)}`);
                reject(e);
            }
        });
    },

    getRank: function(playerId, score) {
        return new Promise(async (resolve, reject) => {
            try {
                const docClient = new AWS.DynamoDB.DocumentClient();
                const parameters = {
                    TableName : config.custom.DynamoDb.tableName,
                    Select: 'COUNT',
                    // ProjectionExpression : 'id',
                    FilterExpression : "score >= :score_value AND id <> :player_id",
                    ExpressionAttributeValues:{
                        ":score_value" : score, 
                        ":player_id" : playerId, 
                    },
                };
                docClient.scan(
                    parameters,
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results.Count + 1);
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    },
};

