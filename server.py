from flask import Flask, render_template, request, redirect, url_for, session, escape

import data_manager
import util

app = Flask(__name__)

app.secret_key = '\xd4S\xb5\xac5\x98+\x0b*>\xb2\x8bQL)\x97'


@app.route('/')
def display_info():
    return render_template('index.html')


@app.route('/registration', methods=['GET', 'POST'])
def registration():
    if 'username' not in session:
        if request.method == 'POST':
            user_name = request.form['username']
            user_list_dicts = data_manager.get_user_dicts()
            user_list = data_manager.get_user_list(user_list_dicts)
            if user_name not in user_list:
                new_password = request.form['password']
                hashed_password = util.hash_password(new_password)
                data_manager.add_new_user_data(user_name, hashed_password)
                return redirect('/')
            else:
                return render_template('registration.html', exist=True)
        return render_template('registration.html', exist=False)
    return redirect('/')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        plain_text_password = request.form['password']
        if username and plain_text_password:
            if data_manager.is_valid_user(username):
                hashed_password = data_manager.get_hashed_pw(username)
                if util.verify_password(plain_text_password, hashed_password):
                    session['username'] = request.form['username']
                    return render_template('index.html', username=escape(session['username']))
                else:
                    return render_template('login.html', logged_in=False, error=True, incomplete=False)
            else:
                return render_template('login.html', logged_in=False, error=True, incomplete=False)
        else:
            return render_template('login.html', logged_in=False, error=None, incomplete=True)
    return render_template('login.html', logged_in=False, error=None, incomplete=False)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)
