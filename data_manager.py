from psycopg2.extras import RealDictCursor
import database_common
from psycopg2 import sql
import datetime


@database_common.connection_handler
def add_new_user_data(cursor: RealDictCursor, username: str, password: str):
    query = """
        INSERT INTO users
        (username, password, registration_date)  
        VALUES (%(user)s, %(psw)s, %(date)s);
        """
    cursor.execute(query, {'user': username, 'psw': password,
                           'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})


@database_common.connection_handler
def is_valid_user(cursor: RealDictCursor, username: str):
    query = """
            SELECT username FROM users
            WHERE username = %(u_a)s;
            """
    cursor.execute(query, {'u_a': username})
    if cursor.fetchone():
        return True
    else:
        return False


@database_common.connection_handler
def get_hashed_pw(cursor: RealDictCursor, username: str):
    query = """
            SELECT password FROM users
            WHERE username = %(u_a)s;
            """
    cursor.execute(query, {'u_a': username})
    return cursor.fetchone()['password']


@database_common.connection_handler
def get_user_id(cursor: RealDictCursor, username: str):
    query = """
        SELECT id FROM users
        WHERE username = %(u_a)s;
        """
    cursor.execute(query, {'u_a': username})
    return cursor.fetchone()['id']


@database_common.connection_handler
def get_user_dicts(cursor: RealDictCursor):
    query = """
        SELECT username FROM users;
        """
    cursor.execute(query)
    return cursor.fetchall()


def get_user_list(user_list_dicts):
    user_list = []
    for user_dict in user_list_dicts:
        user_list.append(user_dict['username'])
    return user_list