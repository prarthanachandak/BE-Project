import json
from flask import Flask, request, jsonify
from ml_model import recommend_chat_rooms
import pandas as pd
import pandas as pd
import requests
from io import StringIO
from github import Github

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/process_data', methods = ['POST'])
def process_data():
    print("Req")
    print(request)
    print("content")
    print(request.content_type)
    print(request.json)
    if request.content_type == 'application/json':
            # Get input data from JSON request
            data = request.json
            print(data)
            domain = data['domain']
            age = int(data['age'])
            reputation = float(data['reputation'])
    else:
            # Get input data from form data
            domain = request.form['domain']
            age = int(request.form['age'])
            reputation = float(request.form['reputation'])

        # Get recommendations using your recommendation function
    recommendations =recommend_chat_rooms(domain, age, reputation)  # Replace with your actual recommendations

        # Serialize the recommendations to JSON
    recommendations_json = json.dumps(recommendations)
        # Return the JSON response
    return jsonify(recommendations_json)

@app.route('/create_room', methods=['POST'])
def create_room():
    global data  # Declare data as a global variable
    if request.method == 'POST':
        access_token = "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"
        g = Github(access_token)
        repo = g.get_repo("archis-07/KNN_recommendation")
        file_path = "Study_rooms_dataset_final.csv"
        content = repo.get_contents(file_path)
        latest_sha = content.sha
        data_url = content.download_url

        response = requests.get(data_url)
        data_str = response.content.decode("utf-8")
        data = pd.read_csv(StringIO(data_str))

        roomData = request.json
        print(data)
        domain = roomData['domain']
        age = int(roomData['age'])
        reputation = float(roomData['reputation'])
        room = roomData['Recommended chat rooms']

        new_room = pd.DataFrame({
            'Domain': [domain],
            'Age': [age],
            'Level of Study': [None],
            'Activity Level': [None],
            'Reputation': [reputation],
            'Accessibility': [None],
            'Moderation': [None],
            'Gender': [None],
            'Country': [None],
            'Recommended chat rooms': [room]
        })
        print(new_room)
        # Concatenate the new room DataFrame with the existing data
        data = pd.concat([data, new_room], ignore_index=True)

        # Save the updated dataset to GitHub
        csv_data = data.to_csv(index=False)
        repo.update_file(file_path, "Update dataset", csv_data, latest_sha, branch="main")

        return "New room created and added to the dataset!"
    # else:
    #     return """
    #     <form action="/create_room" method="POST">
    #         <label for="room">Room:</label><br>
    #         <input type="text" id="room" name="room"><br>
    #         <label for="domain">Domain:</label><br>
    #         <input type="text" id="domain" name="domain"><br>
    #         <label for="age">Age:</label><br>
    #         <input type="number" id="age" name="age"><br>
    #         <label for="reputation">Reputation:</label><br>
    #         <input type="number" id="reputation" name="reputation"><br><br>
    #         <input type="submit" value="Submit">
    #     </form>
    #     """
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000)
