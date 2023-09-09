class LikeCountElem{
    element: HTMLDivElement | null
    value: string | undefined
    constructor(){
        this.element = document.getElementById("likesDone") as HTMLDivElement | null
        this.value = this.element?.innerText
    }
    update(likesCount: number){
        if (this.element) {
            this.element.innerText = likesCount as unknown as string
        }
    }
}


let DOMElems = {
    btn: document.getElementById('startStopBtn')    
}

const methods = {
    sendToContentScript: function (tabId: number, message: object, expectedResponse: string) {
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (typeof response === "undefined") {
                    reject("'" + expectedResponse + "' from Content Script not recieved")
                } else if (response[expectedResponse]) {
                    resolve(response)
                } else if (response.error) {
                    reject(response.error)
                } else {
                    reject("A imProper Response was recived")
                }
            })
        })
    },
}

//Event Listners
DOMElems.btn?.addEventListener('click', ()=>{
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        if (tabs[0].id) {
            methods.sendToContentScript(tabs[0].id, {action: "startStopLikeInterval"}, "started").catch((err)=>{
                console.error(err);
            })
        }
    })
})

document.addEventListener('DOMContentLoaded', ()=>{
    chrome.runtime.sendMessage({action: "Send Likes Count"}, response =>{
        const likeCountElem = new LikeCountElem()
        likeCountElem.update(response.likesCount)
    })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if (request.likesCount) {
        const likeCountElem = new LikeCountElem()
        likeCountElem.update(request.likesCount)
    }
})