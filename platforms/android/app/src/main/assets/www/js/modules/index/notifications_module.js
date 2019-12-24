"use strict"

//Make this as a closure
var length = 0;
//Notifications
function appendItems(number, list) {
    console.log('length is', length);
    const originalLength = length;
    for (var i = 0; i < number; i++) {
        const el = document.createElement('ion-list');
        el.classList.add('ion-activatable', 'ripple', 'not_read');
        el.innerHTML = `
                
                <ion-item lines="none">
          <ion-avatar slot="start">
            <img src="https://www.gravatar.com/avatar/${i + originalLength}?d=monsterid&f=y">
        </ion-avatar>
        <ion-label>
            <h2>${users[i + originalLength].name}</h2>
            <span>${users[i + originalLength].created}</span>
            <p>${users[i + originalLength].desc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
        list.appendChild(el);
        length++;
    }
}

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

//List element we are appending to
const list = document.getElementById('list');
const infiniteScroll = document.getElementById('infinite-scroll');

/*
 * We add an event listener to the infinite-scroll element that when the scroll reaches
 * the bottom, it appends new elements
 */
infiniteScroll.addEventListener('ionInfinite', async function () {
    if (length < users.length) {
        console.log('Loading data...');
        await wait(500);
        infiniteScroll.complete();
        appendItems(10, list);
        console.log('Done');
    } else {
        console.log('No More Data');
        infiniteScroll.disabled = true;
    }
});
appendItems(20, list);