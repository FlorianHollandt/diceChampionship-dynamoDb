

<img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_title.png">

The Dice Championship project is about exploring how a simple voice app - Dice Championship - can be implemented and extended using different frameworks, platforms and services. It was initiated (and <a href="https://www.amazon.com/dp/B07V41F2LK">published to the Alexa Skill store</a>) by me (<a href="https://twitter.com/FlorianHollandt">Florian Hollandt</a>), but contributions of ideas, implementations and improvements are very welcome. :)

## What does the voice app do?

It lets you throw 10 six-dided dice per turn, adds up the dice faces to your score, submits your highest score to a leaderboard, informs you about your current rank, and prompts you to play again. Here's a typical dialog sample, along with the control flow that creates it: <br/>
<img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_controlFlow.png" width="90%">

The reason for choosing this very simple voice game is obviously not its superior engagement: It's simple enough to cover its handler functions in a single file, and the leaderboard and 'game loop' make it complex enough to be interesting.

The original version of Dice Championship was developed as a <a href="https://github.com/FlorianHollandt/jovo-example-mysql">Jovo sample project</a> to showcase the <a href="https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-db-mysql">Jovo framework's MySQL implementation</a>.

## What variations are existing and planned?

Here's a preliminary list:

<table>
    <tr>
        <th>
            Version name
        </th>
        <th>
            Framework / platform
        </th>
        <th>
            Completeness
        </th>
        <th>
            Leaderboard engine
        </th>
        <th>
            Extra feature
        </th>
        <th>
            Status
        </th>
    </tr>
    <tr>
        <td>
            Base version (this repo)
        </td>
        <td>
            Jovo
        </td>
        <td>
            Simplified
        </td>
        <td>
            DynamoDB
        </td>
        <td>
            —
        </td>
        <td>
            :white_check_mark: Complete
        </td>
    </tr>
    <tr>
        <td>
            Live Alexa Skill version
        </td>
        <td>
            Jovo
        </td>
        <td>
            Complete
        </td>
        <td>
            DynamoDB
        </td>
        <td>
            —
        </td>
        <td>
            :construction: Under construction
        </td>
    </tr>
    <tr>
        <td>
            GameOn version
        </td>
        <td>
            Jovo
        </td>
        <td>
            Simplified
        </td>
        <td>
            GameOn
        </td>
        <td>
            —
        </td>
        <td>
            :alembic: Public beta
        </td>
    </tr>
    <tr>
        <td>
            AWS Aurora version
        </td>
        <td>
            Jovo
        </td>
        <td>
            Simplified
        </td>
        <td>
            AWS Aurora
        </td>
        <td>
            —
        </td>
        <td>
            :construction: Under construction
        </td>
    </tr>
    <tr>
        <td>
            AWS RDS version
        </td>
        <td>
            Jovo
        </td>
        <td>
            Simplified
        </td>
        <td>
            MySQL DB via AWS RDS
        </td>
        <td>
            —
        </td>
        <td>
            :construction: Under construction
        </td>
    </tr>
    <tr>
        <td>
            Google Spreadsheet version
        </td>
        <td>
            Jovo
        </td>
        <td>
            Simplified
        </td>
        <td>
            Google Spreadsheet
        </td>
        <td>
            —
        </td>
        <td>
            :construction: Under construction
        </td>
    </tr>
    <tr>
        <td>
            ASK-SDK v2 version
        </td>
        <td>
            ASK-SDK v2
        </td>
        <td>
            Simplified
        </td>
        <td>
            DynamoDB
        </td>
        <td>
            —
        </td>
        <td>
            :pencil2: Planned
        </td>
    </tr>
</table>

For each of these projects I plan to include not only the source code, but also a guide and/or a setup script to get you started.

## What makes this the 'Base version'?

It's a somewhat arbitrary decision, but it makes sense for this project to have one version to highlight differences against. This version uses the Alexa platform and a <a href="https://aws.amazon.com/dynamodb/">DynamoDB database</a>, both of which are vanilla choices. It also uses the <a href="https://github.com/jovotech/jovo-framework">Jovo framework</a>, whose cross-platform capabilities and <a href="https://github.com/jovotech/jovo-cli">powerful CLI</a> (allowing a local development endpoint, staging, and simple deployment) make it a solid starting point for this project.

As a base version, this voice app also has a simplified set of handlers and one piece of odd behavior, in order to make it easier to both set up and understand:
- The most relevant simplification first: The base version doesn't use a database to store user data (only one for the leaderboard). The rationale here is to make it easier to set up this project and to get to the core functionality faster. This implies the following:
  - The voice app doesn't identify returning users, and therefore only contains placeholder code (and translation resources) to cover returning users
  - Data are only persisted at the session-level using session attributes
  - For the highscore, each session is evaluated as a new user. This is a design choice, as it populates the leaderboard faster and thus makes it more interesting to test.
- Another simplification is only the happy path (including a graceful exit) is implemented, i.e. there are not handler for help intents and unhandled cases 

However, the core of the voice game - pushing your highscore and playing more rounds to rise through the ranks - works as in the live version of the game, where the implementation of the full feature set can be investigated.

## Are contributions welcome?

Definitely! If you
- have ideas for other implementations and extensions
- want to implement Dice Championship in your favorite framework or platform
- know how to improve the implementation of any version
please don't hesitate to get in touch with me, or get started right way.

I hope you find this as educational and interesting as me! :)

# Setting up the base version

Even though DynamoDB is the default database choice for voice apps, we need to set up both the actual database table, and the required access to it. As promised, this repo contains everything to get you set up in 3 steps.

1. **Setting up the project folder**
   - Clone this repository, run `npm install --save` and make a copy of `.env.example` named `.env`. We'll use environment variables to set up all the required credentials.<br/>
   - You can already make a decision about your database table name (let's say `diceChampionship`) and favorite AWS region (e.g. Ireland/`eu-west-1`) for the steps and services described below, and include them in your `.env` file like this: `DYNAMODB_REGION='eu-west-1'` and `DYNAMODB_TABLE_NAME='diceChampionship'`
2. **Setting up access to your DynamoDB table**
   - Depending on whether you want to run the Skill locally or on Lambda, you need either a **programmatic user** (aka serivce account) a **role** with access to your new table. To cover both, start out by creating a new <a href="https://console.aws.amazon.com/iam/home?#/policies">AWS IAM policy</a> 'diceChampionship_policy' using the one from `policy.json` in this repo.
   - Change the resource ARN for the first group in line 14 if you chose a different table name in **step 1**.
   - Create a new <a href="https://console.aws.amazon.com/iam/home?#/users">AWS IAM user</a> 'diceChampionship_user' with programmatic access and the policy 'diceChampionship_policy' you just created. Instead of downloading the credentials file, you can directly **copy the access key ID and secret access key** into your `.env` file as `DYNAMODB_ACCESS_KEY_ID='<your-access-key-id>'`and `DYNAMODB_SECRET_ACCESS_KEY='<your-secret-access-key>'`.
   - Simliarly, create a new <a href="https://console.aws.amazon.com/iam/home?#/roles">AWS IAM role</a> `diceChampionship_role`, again with the 'diceChampionship_policy' policy from above. It already has write access to CloudWatch logs, so you know what's going on on your Lambda.
3. **Creating your DynamoDB table**
   - For your convenience, I provided a **setup script** `setup.js` in this repo that uses the config and credentials from your `.env` file along with the table config from `src/config.js` to create the required table.
   - The table will be set up with a reserved **read and write capacity** of 1 each, because that's what's eligible for the AWS free tier. If you prefer 'on-demand' scaling and billing, choose 'pay-per-request' as your billing mode.
   - To execute this script, run `node setup.js` from your command line. It will check which DynamoDB tables exist in your region, and **create a new table** with the name of `DYNAMODB_TABLE_NAME` from your `.env` file ('diceChampionship' by default) if it doesn't
4. **Creating your Lambda function**
   - I didn't provide a setup script for your Lambda function, as this would have used an excessive amount of access privileges. However, setting up a Lambda function is a routine thing, so let's quickly walk through this!
   - Open the <a href="https://console.aws.amazon.com/lambda/home?#/functions">AWS Lambda functions overview</a> in your selected region and hit **Create function**.
   -  Give your Lambda a Node 8.10 runtime (or above) and the existing role 'diceChampionship_role' from **step 2**.
   -  Add **'Alexa Skills Kit' as a trigger** for your Lambda function. For now you can disable the restriction to a defined Skill ID.
   -  Copy the **environment variable** `DYNAMODB_TABLE_NAME` and its value (`diceChampionship` per default) from your local `.env` file to the Lambda's environment variable section.
   -  Copy the **Lambda's ARN** into your local `.env` file, as the value of `LAMBDA_ARN_STAGING` (more on staging below).
5. **Creating the Alexa Skill**
   - This is something you could do directly in the Alexa developer console, but here we're using the <a href="https://github.com/jovotech/jovo-cli">Jovo CLI</a> because it's super convenient. So be sure to have the Jovo CLI installed and optimally your <a href="https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html">ASK CLI and AWS CLI profiles set up</a>.
   - Write the name of the ASK CLI profile you plan to use into your local `.env` file as e.g. `ASK_PROFILE='default'`.
   - Now execute `jovo build -p alexaSkill --stage local --deploy` from your command line. This builds the Skill manifest (`platforms/alexaSkill/skill.json`) and language model (`platforms/alexaSkill/models/en-US.json`) from the information in the project configuration file (`project.js`) and the Jovo language model (`models/en-US.json`), and uses them to set up a new Skill 'Dice Tournament' in your Alexa developer console.<br/>
    The result should look like this:<br/>
    <img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_buildLocal.png" width="65%"><br/>
    - Now copy the Skill ID from the console output and paste it as the value of the `SKILL_ID_STAGING` variable in your `.env` file.
    - Execute `jovo run --watch` from your command line to **activate your local endpoint**

## Congrats, you've already set up the Skill on your machine
You can already test your Skill in the Alexa developer console, or on your device by saying "Alexa, open Dice Tournament"!

The remaining steps are optional, but recommended. Before we proceed to uploading the Skill to Lambda, let me explain the staging setup.

6. **Reviewing the staging setup**
   - This project comes  with a setup for **three stages**, to propagate good practices and let you try out things both locally and on Lambda, because it might behave differently (e.g. in terms of latency)
    <table>
        <tr>
            <th>
                Name
            </th>
            <th>
                Description
            </th>
            <th>
                Environment <br/>
                + Endpoint
            </th>
            <th>
                Database
            </th>
            <th>
                Skill ID
            </th>
            <th>
                Invocation name
            </th>
            <th>
                Skill icon
            </th>
        </tr>
        <tr>
            <td>
                local
            </td>
            <td>
                Local endpoint for rapid development + debugging
            </td>
            <td>
                <code>${JOVO_WEBHOOK_URL}</code>
            </td>
            <td>
                <code>DYNAMODB_TABLE_NAME</code>
            </td>
            <td>
                <code>SKILL_ID_STAGING</code>
            </td>
            <td>
                dice tournament
            </td>
            <td>
                <img src="https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png">
            </td>
        </tr>
        <tr>
            <td>
                staging
            </td>
            <td>
                Lambda endpoint for testing on a production-like environment
            </td>
            <td>
                <code>LAMBDA_ARN_STAGING</code>
            </td>
            <td>
                <code>DYNAMODB_TABLE_NAME</code>
            </td>
            <td>
                <code>SKILL_ID_STAGING</code>
            </td>
            <td>
                dice tournament
            </td>
            <td>
                <img src="https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png">
            </td>
        </tr>
        <tr>
            <td>
                live
            </td>
            <td>
                Lambda endpoint for fulfillment of the live Skill
            </td>
            <td>
                <code>LAMBDA_ARN_LIVE</code>
            </td>
            <td>
                <code>DYNAMODB_TABLE_NAME</code>*
            </td>
            <td>
                <code>SKILL_ID_LIVE</code>
            </td>
            <td>
                dice championship
            </td>
            <td>
                <img src="https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChallenge_small.png">
            </td>
        </tr>
    </table>
    * It would make sense for your live Skill to use a different database than the `local` and `staging` stages<br/><br/>
7. **Uploading your Skill code to Lambda**
   - After having reviewed the staging setup, it's clear that uploading your Skill to Lambda is as easy as building and deploying the **staging stage** of your project.
   - To be able to upload your code to Lambda with the Jovo CLI, make sure your AWS CLI profile is linked to your ASK CLI profile, and has Lambda upload privileges
   - Now all you need to do it execute `jovo build -p alexaSkill --stage staging --deploy`
   - The result should look like this: <br/>
    <img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/diceChampionship_buildStaging.png" width="90%"><br/>
   - Again, you can now test your Skill in the Alexa developer console just like after step 5, in the same Skill
8. **Preparing and deploying the live stage**
   - I'll cover this part more briefly than the ones before, because it's more about deployment than about getting this Skill to work
   - First, you need a **new Lambda function** - Just set one up like in **step 4** (with the same role, trigger and environment variables), and copy its ARN as the value of `LAMBDA_ARN_LIVE` in your `.env` file
   - If you want to use a **different DynamoDB table** for your live stage, you need to set one up (with the same hash key `id`), paste its name into the environment variable `DYNAMODB_TABLE_NAME` of your Lambda function, and accordingly expand your policy `diceChampionship_policy`'s resource part
   - To set up the **new Skill** (using the new Lambda endoint, the invocation name 'dice championship', and an expanded version of the manifest including a different Skill icon), execute `jovo build -p alexaSkill --stage live --deploy`. 
   - After the first deployment, copy the new Skill's ID and paste it as the value of `SKILL_ID_LIVE` in your `.env` file

# Investigating your leaderboard

Before checking your leaderboard, it makes sense to play some sessions so it's already populated. What's the highest score **you** can roll? :slot_machine:

You can view the content of your leaderboard directly by going into the <a href="https://eu-west-1.console.aws.amazon.com/dynamodb/home?#tables:">overview of DynamoDB tables</a> in your selected region, clicking on your table's name and then selecting the tab 'items':<br/>
<img src="https://dicechampionship.s3-eu-west-1.amazonaws.com/screenshots/investigate_dynamoDb.png" width="60%">


# Wrapping it up
I hope you find both this entire project and the individual variants interesting and valuable. Again, if you like this project and want to see it implementing your favorite platform, service or feature, please get in touch or start implementing right away.

## Thanks for reading! :)