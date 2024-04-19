import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
DATABASE_NAME = 'mentalHealth.db'

def addReinforcement(reinforcement):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    insert_query = '''
    INSERT INTO reinforcement (reinforcement) VALUES (?);
    '''

    cursor.execute(insert_query, (reinforcement,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Reinforcement added successfully'})
def get_reinforcements():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    select_query = '''
        SELECT reinforcement FROM reinforcement;
    '''

    cursor.execute(select_query, ())
    reinforcements = [entry[0] for entry in cursor.fetchall()]
    conn.close()
    return jsonify({'reinforcements': reinforcements})

