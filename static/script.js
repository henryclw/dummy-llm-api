function fetchRequests() {
    fetch('/admin/requests')
        .then(response => response.json())
        .then(requests => {
            const listElement = document.getElementById('request-list');
            listElement.innerHTML = ''; // Clear current list

            requests.forEach(request => {
                const requestElement = document.createElement('div');
                requestElement.textContent = `Request ID ${request.id}: ${JSON.stringify(request.data)}`;
                listElement.appendChild(requestElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', fetchRequests);
