import requests
import random
import redis
import pymysql
import json
import os
import smtplib

rclient = redis.Redis(host='localhost', port=6379)
# api_endpoint = "https://www.cricbuzz.com/match-api/livematches.json"
# api_endpoint += ("?rand=" + str(random.randint(1,1000)))
# response = requests.get(api_endpoint)
# match_raw_data = json.loads(response.text)
# match_raw_data = match_raw_data["matches"]

dir_path = os.path.dirname(os.path.realpath(__file__))
match_raw_data = json.loads(open(dir_path + "/sample.json", "r").read())["matches"]
# print match_raw_data

def get_from_request_data(data, field):
    if field == "mom_player_id":
        if len(data["mom"]) > 0:
            return data["mom"][0]
        return ""
    elif field == "result":
        return data["status"]
    elif field == "state":
        return data["state_title"]
    else:
        return data[field]

# if rclient.get("matchDataRaw") != str(response.text):
dbconnection = pymysql.connect(host='localhost', user='root', password='zomato@2019', db='sportsbet', cursorclass=pymysql.cursors.DictCursor)
cursor = dbconnection.cursor()
update_fields = ["mom_player_id", "winning_team_id", "state", "result"]
redis_data = json.loads(rclient.get("matchData"))
new_match_data = dict()
server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
server.login("sportsbetzomato", "zomato@2019")

senderemail = "sportsbetzomato@gmail.com"

for matchid in redis_data:
    new_match_data[matchid] = redis_data[matchid]
    if redis_data[matchid]["bettable"] == 1 or matchid not in match_raw_data:
        continue
    currmatch = redis_data[matchid]
    sql = "UPDATE matches set "
    updateclause = ""
    whereclause = " WHERE id = '" + matchid + "';"

    for field in update_fields:
        cache_value = currmatch[field]
        req_value = get_from_request_data(match_raw_data[matchid], field)
        if cache_value != req_value:
            print cache_value, "->", req_value
            new_match_data[matchid][field] = req_value
            updateclause += (field + " = '" + str(req_value) + "',")

            if field == "winning_team_id":
                type_pred = "team"
            
            elif field == "mom_player_id":
                type_pred = "mom"

            if field in ["winning_team_id", "mom_player_id"]:
                cursor.execute("SELECT * FROM predictions WHERE match_id = %s AND type = '%s' AND entity_id = %d AND processed != 1;" % (matchid, type_pred, int(req_value)))
                results = cursor.fetchone()
                if results:
                    pred_id = results["id"]
                    pred_reward = results["reward"]
                    print str(pred_id), " reward-", str(pred_reward)

                    cursor.execute("UPDATE predictions SET processed = 1, correct = 1 WHERE id = %d" % (pred_id))
                    dbconnection.commit()

                    cursor.execute("SELECT u.id, u.username, p.reward FROM users u INNER JOIN prediction_user_mapping pu ON u.id = pu.user_id INNER JOIN predictions p ON pu.prediction_id = p.id WHERE p.id = %d" % (pred_id))
                    users = cursor.fetchall()

                    if len(users) > 0:
                        user_ids = []
                        for user in users:
                            user_ids.append(str(user["id"]))

                        user_ids_str = ",".join(user_ids)
                        user_ids_str = "(" + user_ids_str + ")"
                        print "userids-" + user_ids_str

                        cursor.execute("UPDATE users SET rewards = rewards + %d WHERE id in %s" % (pred_reward, user_ids_str))
                        dbconnection.commit()

                        for user in users:
                            receiveremail = user["username"]
                            message = " Subject: You predicted correct! \n\n \
                            Congratulations! You won " + str(pred_reward) + " reward points!\n \
                                Your " + str(type_pred) +  " prediction for the " + currmatch["team1"]["name"] + " vs " + currmatch["team2"]["name"] + " was correct!"
                            server.sendmail(senderemail, receiveremail, message)
                


    if len(updateclause) > 0:
        updateclause = updateclause.rstrip(",")
        sql = sql + updateclause + whereclause
        print sql
        cursor.execute(sql)
        dbconnection.commit()
        result = cursor.fetchall()

new_match_data = json.dumps(new_match_data, separators=(',', ':'))
rclient.set("matchData", new_match_data)
rclient.expire("matchData", 60*60)




