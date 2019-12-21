# Heuristica Application, version 1.0-SNAPSHOT
Heuristica is a Rest API and a web view for testing geometric algorithms and NP-complete problems on a random distribution points.
The version 1.0-SNAPSHOT provide only our implementation of:
- The minimum covering circle and its diameter
- Convex envelope
- Traveling Salesman Problem resolved by 2-Opt
- Multiple Traveling Salesman Problem with budged resolved by TSP and fixed charges in sectors taking 2π/n of minimum covering circle

## To run local server, listening port `5005` for remote debugging
```
mvn clean install
mvn compile quarkus:dev -Ddebug
```

## To run server with AWS Lambda
- Make sure you have installed Java8, Maven, AWS-CLI and AWS-SAM with your credentials

- To Run Server on JVM Serveless Container
    ```
    mvn clean install
    aws cloudformation package --template-file sam.jvm.yaml --output-template-file output-sam.yaml --s3-bucket <Existing S3 bucket in the specified region for save dev builds>
    aws cloudformation deploy --template-file output-sam.yaml --stack-name HeuristicaServerless --capabilities CAPABILITY_IAM --region <AWS Region> 
    ```
- To Run Server on provided Lanbda Linux Runtime
    - Make sure you have installed Docker
    - Compile source on native image executable with GraalVm docker container
    ```
        docker-compose up
    ```
    - Run
    ```
  aws cloudformation package --template-file sam.native.yaml --output-template-file output-sam.yaml --s3-bucket <Existing S3 bucket in the specified region for save dev builds>
  aws cloudformation deploy --template-file output-sam.yaml --stack-name HeuristicaServerless --capabilities CAPABILITY_IAM --region <AWS Region>
    ```
 
## To run local web front
- Make sure you have installed NodeJS
- set a Heuristica api url in `view/src/environments/environment.ts`
 - Default value is `http://localhost:8080` knowing that you run server local dev server with `mvn compile quarkus:dev -Ddebug`
 - If you run dev server, on aws, you cant get result Api url, AWS CloudFormation task description
- In `view` folder, Run `npm install` and `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 

## To run Pipeline that performs Production server on AWS Lambda, DynamoDB, S3 then Web distribution on AWS cloudFront
- Configure Jenkins Server and save all needed parameter as global properties
- Improve Jenkins File, push to repository and run pipeline
