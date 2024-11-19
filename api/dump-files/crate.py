from colorama import Fore
import json
import requests
import time
import os

os.system("title Crate Opener")

logText = ""
username = input(Fore.MAGENTA + "Enter username: ")
password = input(Fore.CYAN + "Enter password: ")
amount = int(input(Fore.YELLOW + "Enter amount: "))
input("These actions are irriversible, and you're taking a risk by opening "+Fore.RED+"BASIC"+Fore.YELLOW+" crates. Press enter to continue, close the program to cancel.\n")
token = ""  # do not touch this variable
failCount = 0
successCount = 0

def getToken():
    response = requests.post(
        "https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false",
        data=json.dumps({
            "email": username,
            "password": password,
            "vars": {
                "client_version": "99999"
            },
        }),
        headers={
            "authorization": "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo="
        },
    )

    return json.loads(response.content)["token"]


token = getToken()

def open_crates(amount):
    global successCount
    global failCount
    with open('logs.txt', 'a') as f:
        for i in range(amount):
            payload = "{\"unique\":false}"
            r = requests.post(
                "https://dev-nakama.winterpixel.io/v2/rpc/tankkings_consume_lootbox",
                headers={"authorization": f"Bearer {token}"},
                data=json.dumps(payload))
            response = json.loads(r.content.decode("utf-8"))
            if "true" in str(response):
                tank = json.loads(response['payload'])['award_id']
                if "trail" in tank:
                    logText = "Unlocked the new trail " + tank.split("_")[1]
                else:
                    logText = "Unlocked the new tank " + tank
                print(Fore.GREEN + logText)
                f.write(logText + '\n')
                successCount+=1
            else:
                failCount+=1
                print(Fore.RED + f"{str(failCount)}x fail(s) so far.")
            time.sleep(0.2)


open_crates(amount)
with open('logs.txt','a') as f:
    f.write(Fore.GREEN + f"Got {str(successCount)} new items.\n")
    f.write(Fore.RED + f"Wasted {str(failCount)} crates opportunities.\n")
input(Fore.WHITE + "Finished task. Refer to logs.txt inside the directory in which this file is located to see what you got.")