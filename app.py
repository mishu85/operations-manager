from flask import Flask, request, jsonify, make_response
# install flask_sqlalchemy and (?) sqlalchemy
from flask_sqlalchemy import SQLAlchemy
import uuid  # generates a random public id
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from dotenv import load_dotenv
import os

# https://www.youtube.com/watch?v=WxGBoY5iNXY&ab_channel=PrettyPrinted (34:00)

load_dotenv("local.env")

app = Flask(__name__)

CORS(app)

app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///alchemistSQL.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)

# FSADeprecationWarning: SQLALCHEMY_TRACK_MODIFICATIONS adds significant overhead and will be disabled by default in the future.  Set it to True or False to suppress this warning.
# >>> from pprint import pprint
# >>> from app import app
# >>> pprint(app.config)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
# didn't work

# >>> from app import db
# >>> db.create_all()  // db.drop_all()
# >>> db.session.commit()
# >>> exit()
# /> sqlite3 alchemistSQL.db
# .tables
# .quit / .exit


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50))
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    admin = db.Column(db.Boolean)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(50))
    complete = db.Column(db.Boolean)
    user_id = db.Column(db.Integer)


def check_token(wrapped_func):
    @wraps(wrapped_func)
    def wrapper(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']  # arbitrary key?
        else:
            return jsonify({'message': 'Missing token'})

        try:
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=["HS256"])  # alg. not mentioned at "/login"'s encode
            current_user = User.query.filter_by(
                public_id=data['public_id']).first()
            print("decorator_data: ", data,
                  "decorator_data[public_id]: ", data['public_id'])

        except Exception as e:
            return str(e)  # jsonify({'message': 'Token is invalid!'})

        return wrapped_func(current_user, *args, **kwargs)

    return wrapper


@ app.route("/user", methods=["GET"])
@ check_token
def get_all_users(current_user):

    if not current_user.admin:
        return jsonify({'message': 'Action allowed for admins only'})

    users = User.query.all()
    output = []
    for user in users:
        user_data = {}
        user_data["public_id"] = user.public_id
        user_data["name"] = user.name
        user_data["password"] = user.password
        user_data["admin"] = user.admin
        output.append(user_data)
    return jsonify({"users": output})


@ app.route("/user/<public_id>", methods=["GET"])
@ check_token
def get_user(current_user, public_id):
    user = User.query.filter_by(public_id=public_id).first()
    if not user:
        return jsonify({"message": "No user found"})
    # UserSchema(only=["name", "admin" etc]).dump(user)
    output = UserSchema(exclude=["id", "password"]).dump(user)
    return jsonify({"user": output})


@ app.route("/user", methods=["POST"])
def submit_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method="sha256")
    new_user = User(public_id=str(uuid.uuid4()),
                    name=data["name"], password=hashed_password, admin=False)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "New user created"})


@ app.route("/user/<public_id>", methods=["PUT"])
@ check_token
def promote_user(current_user, public_id):

    if current_user.admin == False:
        return({"message: ": "Promoting an user is allowed only for admin"})

    user = User.query.filter_by(public_id=public_id).first()
    if not user:
        return jsonify({"message": "No user found"})
    elif user.admin == True:
        return jsonify({"message": "User has already been promoted"})
    user.admin = True
    db.session.commit()
    return jsonify({"message": f'User {user.name} has been promoted'})


@ app.route("/user/declass/<public_id>", methods=["PUT"])
@ check_token
def declass_user(current_user, public_id):

    if current_user.admin == False:
        return({"message: ": "Declassing an user is allowed only for admin"})

    user = User.query.filter_by(public_id=public_id).first()
    if not user:
        return jsonify({"message": "No user found"})
    elif user.admin == False:
        return jsonify({"message": f"Action failed: {user.name} is not an admin"})
    user.admin = False
    db.session.commit()
    return jsonify({"message": f'User {user.name} has been declassed'})


@ app.route("/user/<public_id>", methods=["DELETE"])
@ check_token
def delete_user(current_user, public_id):

    if current_user.admin == False:
        return({"message: ": "Deleting an user is allowed only for admin"})

    user = User.query.filter_by(public_id=public_id).first()
    if not user:
        return jsonify({"message": "No user found"})
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user.name} is now no longer a member"})


@ app.route("/login")
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response("Could not verify1", 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    user = User.query.filter_by(name=auth.username).first()
    if not user:
        return make_response("Could not verify2", 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    # hashes the 2nd arg. and compares it with the 1st arg.
    if check_password_hash(user.password, auth.password):
        print("auth.password: ", auth.password)
        print("user.password: ", user.password)
        token_payload = {"public_id": user.public_id,
                         'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=100)}
        token = jwt.encode(token_payload, app.config["SECRET_KEY"])
        return jsonify({'token': token})
    return make_response("Could not verify3", 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})


""" TEST AREA """


@ app.route("/usertest", methods=["GET"])
def get_somepyt():
    users = User.query.all()
    # output = []
    # for user in users:
    #     user_data = {}
    #     user_data["public_id"] = user.public_id
    #     user_data["name"] = user.name
    #     user_data["password"] = user.password
    #     user_data["admin"] = user.admin
    #     output.append(user_data)
    return jsonify({"type: ": str(users)})


@ app.route("/testarea", methods=["GET"])
def tester():
    try:
        # encripted ; request.headers (see all of them)
        return str(request.authorization)
    except Exception as e:
        return str(e)


""" OPERATIONS """


@ app.route("/operations")
def get_all_operations():
    ops = Todo.query.all()

    output = []

    for operation in ops:
        op = {}
        print("get_all_operations_operation: ", operation.user_id)
        # try:
        #     user = User.query.filter_by(public_id=operation.user_id).first()
        #     print("get_all_ops_user: ", user,
        #           ",get_all_ops_user.name: ", user.name, ",type: ", str(type(user)))
        # except Exception as e:

        user = User.query.filter_by(public_id=operation.user_id).first()
        if user:
            op["name"] = user.name
        else:
            op["name"] = "Anonymus"

        op["id"] = operation.id
        op["text"] = operation.text
        op["complete"] = operation.complete
        output.append(op)

    return jsonify({"operations": output})


@ app.route("/operations/<op_id>", methods=["GET"])
@ check_token
def get_one_operation(current_user, op_id):
    operation = Todo.query.filter_by(id=op_id).first()
    if operation:
        op = {}
        user = User.query.filter_by(public_id=operation.user_id).first()
        op["name"] = user.name
        op["id"] = operation.id
        op["text"] = operation.text
        op["complete"] = operation.complete
        return jsonify({"result": op})
    return jsonify({"message": "Operation not found"})


@ app.route("/operations", methods=["POST"])
@ check_token
def create_operation(current_user):
    data = request.get_json()
    new_operation = Todo(
        text=data['text'], complete=False, user_id=current_user.public_id)
    print("create_op_current_user: ", current_user,
          "current_user_public_id: ", current_user.public_id)
    print("")
    db.session.add(new_operation)
    db.session.commit()
    return ({"message: ": "Operation added"})


@ app.route("/myoperations", methods=["GET"])
@ check_token
def show_my_operations(current_user):
    ops = Todo.query.filter_by(user_id=current_user.public_id).all()

    output = []

    for operation in ops:
        op = {}
        # user = User.query.filter_by(
        #     public_id=operation.user_id).first()
        # op["name"] = user.name
        op["id"] = operation.id
        op["text"] = operation.text
        op["complete"] = operation.complete
        output.append(op)

    return jsonify({"operations: ": output})


@ app.route("/operations/<op_id>", methods=["POST"])  # !!!
@ check_token
def modify_operations(current_user, op_id):
    op = Todo.query.filter_by(id=op_id).first()
    if op.user_id == current_user.public_id:
        db.session.get(op)
        db.session.commit()
    else:
        return jsonify({'message': "You can modify only your operations"})

    return ""


@ app.route("/operations/<op_id>", methods=['DELETE'])
@ check_token
def delete_operation(current_user, op_id):
    if current_user.admin == True:
        op = Todo.query.filter_by(id=op_id).first()
        if op:
            db.session.delete(op)
            db.session.commit()

            return jsonify({"message": "Operation deleted"})
        else:
            return jsonify({"message": "Operation couldn't be deleted"})
    else:
        return jsonify({"message": "Deleting an operation is allowed only for admin"})


if __name__ == "__main__":
    app.run(debug=True)
