import boto3
import requests
import os

from requests_aws4auth import AWS4Auth

credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(
    credentials.access_key,
    credentials.secret_key,
    "us-west-2",
    "es",
    session_token=credentials.token,
)

ES_HOST = os.environ.get('ES_HOST')
ES_INDEX = os.environ.get('ES_INDEX')
ES_TYPE = os.environ.get('ES_TYPE')
URL = ES_HOST + "/" + ES_INDEX + "/" + ES_TYPE +"/"


headers = {"Content-Type": "application/json"}


def lambda_handler(event, context):
    count = 0
    
    for record in event["Records"]:
        print(record)

        id = (
            ES_TYPE
            + "_"
            + record["dynamodb"]["Keys"]["id"]["N"]
        )

        if record["eventName"] == "REMOVE":
            r = requests.delete(URL + id, auth=awsauth)
        else:
            document = record["dynamodb"]["NewImage"]
            r = requests.put(URL + id, auth=awsauth, json=document, headers=headers)
        print(r.text)
        count += 1
    return str(count) + " records processed!"