function fetchRequests() {
    fetch('/admin/requests')
    .then(response => response.json())
    .then(data => {
        // Process and display requests in the admin portal
    });
}

// Call this function to load requests on page load
fetchRequests();
