class NavNotification extends HTMLElement {
    constructor() {

    }
    
    connectedCallback() {
        this.innerHTML = "";

        document.getElementById('do_something').addEventListener('click', function () {
            alert("something")
        });
    }
    
    
    
    disconnectedCallback() {
        console.log('Custom square element removed from page.');
    }

    adoptedCallback() {
        console.log('Custom square element moved to new page.');
    }

    attributeChangedCallback() {
        console.log("Attribute changed?")
    }
}