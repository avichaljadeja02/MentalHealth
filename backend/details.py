import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
DATABASE_NAME = 'mentalHealth.db'

@app.route('/update_user', methods=['POST'])
def update_or_create_user():
    user_id = request.json.get('userId')
    new_data = request.json.get('data')
    if update_user_details(user_id, new_data):
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 500

def get_user_details(user_id):
    with sqlite3.connect(DATABASE_NAME) as connection:
        cursor = connection.cursor()
        try:
            query = "SELECT userId, name, dob, phoneNumber, address FROM userDetails WHERE userId = ?"
            cursor.execute(query, (user_id,))
            row = cursor.fetchone()
            if row:
                # Creating a dictionary of user details
                user_details = {
                    'userId': row[0],
                    'name': row[1],
                    'dob': row[2],
                    'phoneNumber': row[3],
                    'address': row[4]
                }
                return user_details
            else:
                return None

        except sqlite3.Error as error:
            print("Error fetching user details:", error)
            return None


def update_user_details(user_id, new_data):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    try:
        if get_user_details(user_id):
            parts = [f"{key} = ?" for key in new_data]
            values = list(new_data.values())
            values.append(user_id)
            query = f"UPDATE userDetails SET {', '.join(parts)} WHERE userId = ?"
        else:
            columns = ', '.join(new_data.keys())
            placeholders = ', '.join('?' * len(new_data))
            values = list(new_data.values())
            query = f"INSERT INTO userDetails (userId, {columns}) VALUES (?, {placeholders})"
            values.insert(0, user_id)
        
        # Print data types for debugging
        print("Data types being inserted:", [(value, type(value)) for value in values])
        print("Executing SQL Query:", query)
        cursor.execute(query, values)
        connection.commit()
        return True

    except sqlite3.Error as error:
        print("Error updating user details:", error)
        return False
    finally:
        connection.close()


if __name__ == '__main__':
    app.run(debug=True)
