import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
DATABASE_NAME = 'mentalHealth.db'

def create_table():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    create_table_query = '''
        CREATE TABLE IF NOT EXISTS goals (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER,
        goal VARCHAR(500),
        reminderDate DATETIME
    );
    '''

    cursor.execute(create_table_query)
    conn.commit()
    conn.close()

def add_goals(uid, goals, date):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    create_table()
    insert_query = '''
    INSERT INTO goals (uid, goal, reminderDate) VALUES (?, ?, ?);
    '''

    cursor.execute(insert_query, (uid, goals, date))
    conn.commit()
    conn.close()

def add_goal(uid,goal, date):
    if uid is None or goal is None:
        return jsonify({'error': 'Missing uid or goal'}), 400

    add_goals(uid, goal, date)
    return jsonify({'message': 'Goal entry added successfully'})


def get_goals_for_uid(uid):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    select_query = '''
    SELECT goal, reminderDate FROM goals WHERE uid = ?;
    '''

    cursor.execute(select_query, (uid,))
    goals = [{'goal': entry[0], 'reminderDate': entry[1]} for entry in cursor.fetchall()]
    conn.close()
    return jsonify({'goals': goals})
