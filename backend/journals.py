import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
DATABASE_NAME = 'mentalHealth.db'
app.config['JSON_AS_ASCII'] = False


def create_table():
    conn = sqlite3.connect('mentalHealth.db', detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
    cursor = conn.cursor()

    create_table_query = '''
    CREATE TABLE IF NOT EXISTS journals (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER,
        journal VARCHAR(500)
    );
    '''

    cursor.execute(create_table_query)
    conn.commit()
    conn.close()


def add_journal_api(uid, journal_text, emoji):
    if uid is None or journal_text is None:
        return jsonify({'error': 'Missing uid or journal'}), 400
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    create_table()
    insert_query = '''
    INSERT INTO journals (uid, journal, emoji) VALUES (?, ?, ?);
    '''

    cursor.execute(insert_query, (uid, journal_text, emoji))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Journal added successfully'})


def get_journals_for_uid(uid):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.execute('SELECT id, uid, journal, emoji FROM journals WHERE uid = ?', (uid,))
    journals = [{'id': id, 'uid': uid, 'entry': entry, 'emoji': emoji} for id, uid, entry, emoji in cursor]
    return jsonify({'journals': journals}), 200


