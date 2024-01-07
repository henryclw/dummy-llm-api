function fetchRequests() {
    fetch('/admin/requests')
        .then(response => response.json())
        .then(requests => {
            const listElement = document.getElementById('request-list');

            requests.forEach(request => {
                // Check if this request is already displayed
                if (!document.getElementById(`request-${request.id}`)) {
                    const requestElement = document.createElement('div');
                    requestElement.id = `request-${request.id}`;
                    requestElement.innerHTML = `
                        <p>Request ID ${request.id}: ${JSON.stringify(request.data)}</p>
                        <textarea id="response-${request.id}" placeholder="Type your response here"></textarea>
                        <button onclick="submitResponse(${request.id})">Submit Response</button>
                    `;
                    listElement.appendChild(requestElement);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

// Poll for new requests every 0.5 seconds
setInterval(fetchRequests, 500);

function submitResponse(requestId) {
    const responseText = document.getElementById(`response-${requestId}`).value;
    fetch('/admin/respond', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ request_id: requestId, response: responseText })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);

        // Update the UI to indicate the response was submitted
        const responseArea = document.getElementById(`response-${requestId}`);
        const submitButton = responseArea.nextSibling; // Assuming the button is the next sibling

        responseArea.disabled = true; // Disable the textarea
        responseArea.style.backgroundColor = '#f0f0f0'; // Change background to indicate disabled state
        submitButton.disabled = true; // Disable the submit button
        submitButton.textContent = 'Submitted'; // Change button text
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, provide feedback about the error
    });
}


document.addEventListener('DOMContentLoaded', fetchRequests);
