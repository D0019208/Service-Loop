document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("fingerprint").addEventListener('click', async () => {
    
    let data = {
            users_email: "dsdf",
            users_password: "sdfdf"
        };
        
//        http://serviceloopserver.ga
//        http://localhost:3000
        const rawResponse = await fetch('http://localhost:3000/test', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const content = await rawResponse.json();
});
});

