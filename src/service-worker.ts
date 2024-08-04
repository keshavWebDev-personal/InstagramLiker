import { webPageContext } from './webPageContext.ts';

let totalLikesCount = 0;
let likesLimit = 0;

// -------------------------------------------------
// ------------------Some Functions-----------------
// -------------------------------------------------

function stopAllLikeTasksLoops():Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
        const manifest = chrome.runtime.getManifest();
        if (manifest.host_permissions) {
            const urlPatterns = manifest.host_permissions;

            // Query for tabs matching these URL patterns
            let tabs = await chrome.tabs.query({ url: urlPatterns });
            for (let tab of tabs) {
                if (!tab.id) return;
                let {status} = await chrome.tabs.sendMessage(tab.id, {
                    type: "action",
                    title: "Stop Likes Task",
                });
                resolve(status)
            }
        }
    })

}

async function startLiking_currPage(
    maxTime: number,
    minTime: number,
    likesLimit: number
): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) {reject("Tab not Valid"); return};
        let {status} = await chrome.tabs.sendMessage(tab.id, {
            type: "action",
            title: "Start Liking",
            maxTime: maxTime,
            minTime: minTime,
            likesLimit: likesLimit,
        });
        resolve(status)
    })
}

// -------------------------------------------------
// -------------Main Event Listner------------------
// -------------------------------------------------

chrome.runtime.onMessage.addListener(({ type, title, ...data }, _, sendResponse) => {
        switch (type) {
            case "action":
                switch (title) {
                    case "Start Liking":
                        (async () => {
                            try {
                                let status = await startLiking_currPage(
                                    data.maxTime,
                                    data.minTime,
                                    likesLimit
                                );
                                sendResponse({ status: status });    
                            } catch (error) {
                                sendResponse({ status: false });    
                            }
                        })()
                        return true
                        break;
                    case "Stop Liking":
                        (async () => {
                            try {
                                let status = await stopAllLikeTasksLoops();
                                sendResponse({ status: status });    
                            } catch (error) {
                                sendResponse({ status: false });    
                            }
                        })()
                        return true
                        break;
                    case "setup webpage context":
                        (async () => {
                            let tabs = await chrome.tabs.query({});
                            tabs.forEach((tab) => {
                                const {host_permissions} = chrome.runtime.getManifest();
                                if (tab.id && tab.url?.match(host_permissions[0])){
                                    chrome.scripting.executeScript({
                                        target: { tabId: tab.id },
                                        func: webPageContext,
                                    });
                                }
                            })
                        })()
                        break
                }
                break;
            case "data":
                switch (title) {
                    case "Did a like":
                        totalLikesCount++;
                        chrome.runtime.sendMessage({
                            type: "data",
                            title: "Like Count",
                            data: totalLikesCount,
                        });
                        // Store total likes count
                        chrome.storage.sync.set({
                            likesCount: {
                                value: totalLikesCount,
                                timestamp: Date.now(),
                            },
                        });

                        if (totalLikesCount >= likesLimit) {
                            stopAllLikeTasksLoops();
                            chrome.runtime.sendMessage({ type: "info", title: "Target Like Reached" });
                        }
                        break;
                    case "give me likes count":
                        (async () => {
                            let res = await chrome.storage.sync.get(["likesCount"]);

                            if (!res.likesCount || res.likesCount.value === undefined) {
                                totalLikesCount = 0
                            }else{
                                const now = new Date();
                                const yesterday10PM = new Date(now);
                                yesterday10PM.setDate(now.getDate() - 1);
                                yesterday10PM.setHours(22, 0, 0, 0);
                            
                                const today10PM = new Date(now);
                                today10PM.setHours(22, 0, 0, 0);
                                if (!( res.likesCount.timestamp >= yesterday10PM.getTime() && res.likesCount.timestamp <= today10PM.getTime() )){
                                    totalLikesCount = 0
                                }else{
                                    totalLikesCount = res.likesCount.value;
                                };
                            };
                            sendResponse({ likes: totalLikesCount });
                        })();
                        return true;
                        break;

                    case "Updated Likes Limit":
                        likesLimit = data.likesLimit
                        chrome.storage.sync.set({
                            likesLimit: {
                                value: likesLimit
                            },
                        });
                        break;
                        
                    case "give me likes limit":
                        (async () => {
                            let res = await chrome.storage.sync.get(["likesLimit"]);
                            if (!res.likesLimit || res.likesLimit.value === undefined) {likesLimit = 0};
                            likesLimit = res.likesLimit.value;
                            sendResponse({likesLimit: likesLimit});
                        })();
                        return true;
                        break;
                }
                break;
        }
    }
);
