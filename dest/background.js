"use strict";
class Likes {
    count;
    constructor() {
        this.count = 0;
    }
}
const likes = new Likes();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "Increment_LikesCount") {
        let likesLimit = 50;
        chrome.storage.sync.get("instagramLikerOptions", (result) => {
            const optionsData = result.instagramLikerOptions;
            if (optionsData && optionsData.hasOwnProperty("likes_limit_count")) {
                const value = optionsData["likes_limit_count"];
            }
            else {
                console.log();
            }
        });
        if (likes.count >= likesLimit) {
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    if (tab.url &&
                        tab.url.includes("instagram.com") &&
                        tab.id) {
                        chrome.tabs.sendMessage(tab.id, {
                            action: "startStopLikeInterval",
                        });
                    }
                });
            });
        }
        likes.count++;
        chrome.runtime.sendMessage({
            action: "update_likesCount",
            data: likes.count,
        });
    }
    if (request.action === "Send Likes Count") {
        sendResponse({ likesCount: likes.count });
    }
});
