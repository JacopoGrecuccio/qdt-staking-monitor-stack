# QDT Staking Monitor

The QDT Staking Monitor is a web-app that allows users to see statistics about Quadrans Token's staking pool on Ethereum Mainnet Network.
The application is made of three fundamental components:
- A **scheduled Lambda function** (watcher) that periodically watches the logs emitted by the staking contract to see if any "Staked" of "Withdrawed" event has occurred since the last observed block. All events are saved in a key-value DB, implemented using AWS DynamoDB, whose schema will be described further.
- An **HTTP REST API** that returns some statistics about the pool (global statistics) and the single stakers (staker statistics)
- A **frontend**, developed in VueJS, that shows to the final user the statistics queried from the REST API

The whole application AWS stack is described in the template.yml file and can be deployed all at once through AWS SAM command-line interface (see deploy instructions)
## Repository organization

- `src/frontend` - Contains the frontend developed in Vue
- `src/handlers/api` - Contains the source code for the Lambda functions that handle the REST API (backend)
- `src/handlers/watcher` - Contains the source code of the Lamba function that updates the indexer DB. This Lambra is triggered by the AWS Scheduled Event module
- `template.yml` - A template that defines the application's AWS resources and sets up the whole stack

Resources for this project are defined in the `template.yml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Database schema
### Table: *QDTStakingPositionsTable*
## REST API


## Deploy instructions
For deploying the whole stack on AWS, AWS-CLI and SAM-CLI have to be installed. In addition, AWS-CLI must be configured with a global user and its secret-key (**IMPORTANT**: the user must have permissions for creating IAM roles)

### Install aws-cli

### Install sam-cli

### Configure a global user on aws-cli

### Configuring global parameters
Before deploying the application, you need to edit `template.yml.example` file with your own specific parameters. Once completed all the step, you can copy or rename the file as `template.yml`

#### *Setting Infura API Key*
The **watcher** component requires a Web3 endpoint in order to access to Ethereum's network and retreive information from the chain.
The easiest solution is to use Infura. After setting up a dedicated project in your Infura account, you will have to replace **<YOUR_INFURA_URL>** and **<YOUR_INFURA_WS_URL>**, into `template.yml.example`, with the generated enpoints URL (for HTTP and WS respectively).

#### *Select watcher function's execution rate*
You can select the frequency of execution for the watcher funciton. Higher value of this parameter will decrease the monitor's latency (**i.e.**: the time between the occurrence of an event on the blockchain and when such event is recorded into the application). However at the same time, augmenting the frequency will obviosly increase the amount of resources consumped on AWS (in terms of Lambda's total execution time).
The default rate is set to 1 call per hour, you can edit in `template.yml.example` file:
```yaml
QDTStakingWatcherFunction:
    Type: AWS::Serverless::Function
    Properties:
      # ...
      Events:
        StartScheduledEvent:
          Type: Schedule
          Properties:
            Schedule: rate(1 hour) # Change the schedule period to desired value
      # ...
```

### Deploy the application
#### *Creating the stack and deploying watcher+backend+DB*
#### *Building the frontend*
At this point we need to build the frontend using npm . Navigate to *src/frontend* , then run:
```bash
npm install
npm run build
```
#### *Deploying the frontend*
Once the frontend is built, we need to sync the `src/frontend/dist` directory with the S3 bucket that holds the static website:

```bash
aws-cli s3 sync <BUCKET_ARN>  
```

##  TODO

- Style and fix styling bugs in frontend application
- Define API call limits: max N requests per minute from the same IP

## Changelog
