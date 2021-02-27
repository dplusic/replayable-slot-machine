# replayable-slot-machine
A demo of Side Effect Recorder. Entry in the yyt #22.


## Sequence Diagrams

### Recording
![Recording Sequence Diagram](docs/recording-sequence-diagram.png)

### Replaying
![Replaying Sequence Diagram](docs/replaying-sequence-diagram.png)


## Record Example

```json
{
  "request": {
    "url": "/pull",
    "body": ""
  },
  "response": {
    "body": "{\"date\":\"2021-02-27T09:22:02.452Z\",\"result\":[\"🏆\",\"📚\",\"🟠\"]}",
    "statusCode": 200,
    "statusMessage": "OK"
  },
  "sideEffects": [
    {
      "request": {
        "url": "http://side-effect-proxy-ext/bulk",
        "body": "{\"date\":\"date\",\"random1\":\"random\",\"random2\":\"random\",\"random3\":\"random\"}"
      },
      "response": {
        "body": "{\"date\":1614417722452,\"random1\":0.39686287119389485,\"random2\":0.7913517275708617,\"random3\":0.9137271972806074}",
        "statusCode": 200,
        "statusMessage": "OK"
      }
    },
    {
      "request": {
        "url": "http://localhost:10004/weights",
        "body": ""
      },
      "response": {
        "body": "[{\"emoji\":\"7️⃣\",\"weight\":1},{\"emoji\":\"🍉\",\"weight\":2},{\"emoji\":\"🍇\",\"weight\":3},{\"emoji\":\"🍋\",\"weight\":4},{\"emoji\":\"🍌\",\"weight\":5},{\"emoji\":\"🏆\",\"weight\":6},{\"emoji\":\"🍒\",\"weight\":7},{\"emoji\":\"📚\",\"weight\":8},{\"emoji\":\"🟠\",\"weight\":9}]",
        "statusCode": 200,
        "statusMessage": "OK"
      }
    }
  ]
}

```


## Running

### Prerequisite
* `npm install` for `app-fe`, `wiehgt-api`, `side-effect-proxy` and `slot-api` 

### Recording

1. Start app-fe
    * `cd app-fe && npm start`
1. Start weight-api
    * `cd weight-api && npm start`
1. Start side-effect-proxy
    * `cd side-effect-proxy && npm start`
1. Start slot-api
    * `cd slot-api && npm start`
1. Change weights
    * http://localhost:10004/weights/edit
1. Pull slot machine
    * http://localhost:10000
1. Check records
    * repository/records/records.jsonl


### Replaying

1. Desired status of servers
    * app-fe: may be stopped
    * weight-fe: may be stopped
    * side-effect-proxy: must be stopped
    * slot-api: must be running
1. Start side-effect-proxy replaying mode
    * `cd side-effect-proxy && npm run replay`
1. Check console results
