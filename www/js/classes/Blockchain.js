class Blockchain {
    constructor() {
        this.blockchain_content = [];
    }

    async load_blockchain_content(post_id) {
        let blockchain_content = await access_route({key: post_id}, 'load_blockchain_content');

        if (!blockchain_content.error) { 
            
            this.blockchain_content = [{post_id: post_id, content: blockchain_content.response.payload}];

            this.append_blockchain_content(post_id);
        } else {
            console.log(blockchain_content.error)
        }
    }

    append_blockchain_content(key) {
        let content_to_append = this.blockchain_content.filter((content) => {
            if (content.post_id === key) {
                return content;
            }
        });

        content_to_append.forEach(function (content) { 
            content.content.forEach(function (content) {
                let block = document.createElement('block');
                let timestamp = content.Timestamp.seconds.low;
                let date_created = new Date(timestamp * 1000);

                let date = convertDate(date_created);
                let time = conver_to_time(date_created);

                block.innerHTML = `
                        <div class="blockchain_entry">
                            <div class="blockchain_cube"><span class="blockchain_icon"><ion-icon color="primary" name="cube"></ion-icon></span></div>
                            <div class="blockchain_block">
                               <!--<div style="top: 24px; left: 100%; border-color: transparent transparent transparent rgb(255, 255, 255);"></div>-->
                               <div class="blockchain_title">${content.Value.title}</div>
                               <div class="blockchain_body">
                                  <p><b>Description: </b>${content.Value.content}</p>
                                  <!--<br><b>Number of Tx: </b>1-->
                                  <span style="background-color:#3880ff;color:white;padding: 5px;"><b>${time}<b></span><span style="position:absolute;right: 15px; font-weight: 100;font-size:8.7pt; bottom: 10px;">${date}</span>
                                  <div class="blockchain_clear"></div>
                               </div>
                            </div>
                            <div class="blockchain_clear"></div>
                         </div>
                    `;

                document.getElementById('blockchain_container').parentNode.insertBefore(block, document.getElementById('blockchain_container').nextSibling);
            });
        });
    }
}