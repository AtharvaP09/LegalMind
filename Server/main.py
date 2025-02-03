from flask import Flask , jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app , origins='*')

@app.route("/")
def users():
    return jsonify(
        {
            "users":[
                'Atharva',
                'Aryan',
                'Rushikesh',
                'Piyush'
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug = True , port = 8080)

#Axios Installation and configuration pending in Client side