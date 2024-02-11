window._endpoint = 'localhost'

fetch(`http://${window._endpoint}:8080/pn.js`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(scriptText => {
        const script = document.createElement('script');
        script.textContent = scriptText;
        document.head.appendChild(script);
    })
    .catch(error => {
        console.error('Error loading script:', error);
    });