import time

from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Define your routes here

db = {"requests": [], "responses": {}}


@app.route('/new-request', methods=['POST'])
def new_request():
    data = request.json
    request_id = len(db["requests"]) + 1
    db["requests"].append({"id": request_id, "data": data, "status": "pending"})

    # Long polling: Wait for admin response
    start_time = time.time()
    while True:
        if request_id in db["responses"]:
            response = db["responses"][request_id]
            return jsonify({"id": request_id, "response": response})

        # Break after a timeout (e.g., 30 seconds) to avoid hanging indefinitely
        if time.time() - start_time > 30:
            return jsonify({"id": request_id, "message": "Response pending", "status": "timeout"}), 202

        time.sleep(1)  # Sleep to prevent busy waiting


@app.route('/admin/requests', methods=['GET'])
def view_requests():
    return jsonify(db["requests"])


@app.route('/admin/respond', methods=['POST'])
def respond():
    response_data = request.json
    request_id = response_data["request_id"]
    response = response_data["response"]

    # Update the request status and store the response
    for req in db["requests"]:
        if req["id"] == request_id:
            req["status"] = "completed"
            break
    db["responses"][request_id] = response
    return jsonify({"message": "Response recorded"})


@app.route('/admin')
def admin_portal():
    return render_template('admin.html')


if __name__ == '__main__':
    app.run(debug=True)
