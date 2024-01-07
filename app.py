from queue import Queue

from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

db = []
request_queues = {}


@app.route('/v1/chat/completions', methods=['POST'])
def new_request():
    data = request.json
    request_id = len(db)
    db.append({"id": request_id, "request": data, "response": None})

    # Create a queue for this request
    request_queues[request_id] = Queue()

    # Notify admin
    socketio.emit('new_request', {"id": request_id, "data": data, "status": "pending"})

    # Wait for the admin's response
    response = request_queues[request_id].get()  # This will block until an item is put in the queue
    db[request_id]["response"] = response

    return jsonify({"id": request_id, "response": response})


@app.route('/admin/view_all', methods=['GET'])
def view_requests():
    return jsonify(db)


# Admin response endpoint
@app.route('/admin/respond', methods=['POST'])
def admin_respond():
    response_data = request.json
    request_id = response_data["request_id"]
    response = response_data["response"]

    # # Update the request status and store the response
    # for req in db["requests"]:
    #     if req["id"] == request_id:
    #         req["status"] = "completed"
    #         break
    # db["responses"][request_id] = response

    # Put the admin's response in the corresponding request's queue
    if request_id in request_queues:
        request_queues[request_id].put(response)
        del request_queues[request_id]  # Remove the queue as it's no longer needed

    return jsonify({"message": "Response recorded"})


@app.route('/admin')
def admin_portal():
    return render_template('admin.html')


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", log_output=True, use_reloader=False, allow_unsafe_werkzeug=True)
