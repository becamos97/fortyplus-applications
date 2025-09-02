from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

# (Optional) Tiny server-side proxy for Numbers API to avoid CORS issues in some setups.
# If you get CORS errors in the browser for http://numbersapi.com, uncomment this block
# and install requests:  pip install requests
# Then change your JS to call /api/numfact/<n> and /api/numfacts?list=1,2,3 instead.
"""
import requests

@app.get("/api/numfact/<int:n>")
def numfact(n):
    r = requests.get(f"http://numbersapi.com/{n}?json", timeout=10)
    return jsonify(r.json())

@app.get("/api/numfacts")
def numfacts():
    from flask import request
    list_str = request.args.get("list", "")
    r = requests.get(f"http://numbersapi.com/{list_str}?json", timeout=10)
    return jsonify(r.json())
"""
if __name__ == "__main__":
    app.run(port=5000)