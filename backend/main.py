from flask import Flask, request, jsonify

import details
import goals
import journals
import reinforcement

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello, world!"

@app.route('/addjournals', methods=['POST'])
def add_journal():
    data = request.json
    uid = data.get('uid')
    entry = data.get('entry')
    emoji = data.get('emoji')

    if None in (uid, entry, emoji):
        return jsonify({'error': 'Missing data'}), 400

    return journals.add_journal_api(uid,entry,emoji)


@app.route('/getjournals', methods=['GET'])
def get_journals():
    uid = request.args.get('uid')

    if uid is None:
        return jsonify({'error': 'Missing uid'}), 400

    return journals.get_journals_for_uid(uid)



@app.route('/addgoal', methods=['POST'])
def add_goal():
    data = request.json
    uid = data.get('uid')
    goal = data.get('goal')
    date = data.get('date')

    if uid is None:
        return jsonify({'error': 'Missing uid'}), 400
    return goals.add_goal(uid, goal, date)

@app.route('/getDetails', methods=['GET'])
def get_details():
    user_id = request.args.get('uid')
    if user_id:
        user_details = details.get_user_details(user_id)
        if user_details:
            return jsonify(user_details), 200
        else:
            return {}, 200
    else:
        return "Invalid request.", 400

@app.route('/addReinforcement', methods=['POST'])
def add_reinforcement():
    data = request.json
    reinforcement_body = data.get('reinforcement')
    if reinforcement_body is None:
        return jsonify({'error': 'Missing reinforcement'}), 400
    return reinforcement.addReinforcement(reinforcement_body)


@app.route('/getgoals', methods=['GET'])
def get_goal():
    uid = request.args.get('uid')  # Get uid from query parameter

    if uid is None:
        return jsonify({'error': 'Missing uid'}), 400

    # Assuming goals.get_goals_for_uid(uid) returns the goals for the specified uid
    return goals.get_goals_for_uid(uid)

@app.route('/getReinforcement', methods=['GET'])
def get_reinforcement():
    return reinforcement.get_reinforcements()

@app.route('/updateDetails', methods=['PUT'])
def update_details():
    user_id = request.args.get('uid')
    if user_id:
        new_data = request.json
        if new_data:
            if details.update_user_details(user_id, new_data):
                return "User details updated successfully.", 200
            else:
                return "Failed to update user details.", 500
        else:
            return "Invalid request data.", 400
    else:
        return "Invalid request.", 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)
