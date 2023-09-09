class Likes{
    count: number
    constructor(){
        this.count = 0
    }
}
const likes = new Likes()

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if (request.likesCount) {
        likes.count = request.likesCount
    }
    if (request.action === "Send Likes Count") {
        sendResponse({likesCount: likes.count})
    }
})