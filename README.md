# Sportsbet

Prediction and rewards system for predicting winners of cricket matches

## Getting Started

The project is written in Node.js and has a background process that uses Python. Database used is MySQL, caching is implemented by using Redis. The project assumes MySQL and Redis instance running on localhost at their respective standard ports. Connects to gmail with smtp for the mailer.

### Installing

To install all the node modules and dependencies run the below command inside the project directory

```
npm install
```

Run below command to install the python modules required

```
pip install redis pymysql
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

To test a sample prediction, update the data in the sample.json file in the given Cricbuzz format. Update the match details according to the result you want to test and the update_state.py will read from the sample file. To actual live fetch results from the API in the process, uncomment the requesting code.

## Built With

* [Cricbuzz API](https://www.cricbuzz.com/match-api/livematches.json) - The API used to get live cricket match updates.