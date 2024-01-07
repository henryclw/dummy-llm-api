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
                    requestElement.className = 'request-item';
                    requestElement.innerHTML = `
                        <p>Request ID ${request.id}: ${JSON.stringify(request.data)}</p>
                        <textarea id="response-${request.id}" placeholder="Type your response here"></textarea>
                        <button id="submit-button-${request.id}" onclick="submitResponse(${request.id})">Submit Response</button>
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

        // Disable the textarea
        const responseArea = document.getElementById(`response-${requestId}`);
        responseArea.disabled = true;

        // Hide the submit button
        const submitButton = document.getElementById(`submit-button-${requestId}`);
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', fetchRequests);

document.addEventListener('DOMContentLoaded', function() {
    // Set dark mode by default
    document.body.classList.add('dark-mode');
    document.getElementById('theme-switch-button').textContent = 'Switch to Light Theme';

    document.getElementById('theme-switch-button').addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            this.textContent = 'Switch to Dark Theme';
        } else {
            document.body.classList.add('dark-mode');
            this.textContent = 'Switch to Light Theme';
        }
    });
});


