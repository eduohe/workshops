import json
import boto3 

print('Loading function')

s3 = boto3.resource('s3')

def lambda_handler(event, context):

    for record in event['Records']:
        id = record["dynamodb"]["Keys"]["id"]["N"]
        fields_list = []
        fields_list.append(id)
        fields_list.append(record["dynamodb"]["NewImage"]["name"]["S"])
        fields_list.append(record["dynamodb"]["NewImage"]["category"]["S"])
        fields_list.append(record["dynamodb"]["NewImage"]["price"]["N"])
        fields_list.append(record["dynamodb"]["ApproximateCreationDateTime"])
        fields_list.append(record["eventName"])
        
        csv_string = ','.join(map(str, fields_list))

        
        object = s3.Object('<yourname>-dynamo-s3', '{}.csv'.format(id))
        object.put(Body=csv_string)

    return 'Successfully processed {} records!'.format(len(event['Records']))
