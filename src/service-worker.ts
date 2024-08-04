let totalLikesCount = 0;
let likesLimit = 0;

// -------------------------------------------------
// ------------------Some Functions-----------------
// -------------------------------------------------


function webPageContext() {
    let randTime = 0;
    let taskRunning = false;
    let timeOutId: number | null = null;
    let interId:number | null = null
    let raf:number | null = null;

    let getNextBtn = (): Promise<SVGElement> => {
        return new Promise((resolve, reject) => {
            let likeElem: SVGAElement | null = document.querySelector('svg[aria-label="Next"]');
            if (likeElem) resolve(likeElem);
            
            let timeLimit = 2
            let i = 0
            let check = () => {
                if (i > timeLimit * 60) reject("getNextBtn() :- "+ timeLimit + " secs have passed\n and 'next' element wasnt found,\n therefore :-");

                likeElem = document.querySelector('svg[aria-label="Next"]');
                if (!likeElem) {
                    i++;
                    raf = requestAnimationFrame(check);
                } else resolve(likeElem);
            };
            check();
        });
    };
    
    let likeTaskRecursive = async (maxTime: number, minTime: number, likesLimit: number) => {
        taskRunning = true;
        let likeElem = document.querySelector(
            'svg[aria-label="Like"][height="24"]'
        );

        if (likeElem){
            likeElem.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            chrome.runtime.sendMessage({
                type: "data",
                title: "Did a like",
            });
            randTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
            console.log("randTime: " + randTime + "Min: " + minTime + "Max: " + maxTime);
        }else{
            randTime = 0
        }

        timeOutId = setTimeout(async ()=>{
            try {
                const nextBtn = await getNextBtn()
                nextBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                likeTaskRecursive(maxTime, minTime, likesLimit)                
            } catch (error) {
                console.log(error);
                chrome.runtime.sendMessage({
                    type: "data",
                    title: "reached end of page",
                });
                
                taskRunning = false;
            }
        }, randTime);
    }
    chrome.runtime.onMessage.addListener(
        ({ type, title, ...data }, _, sendResponse) => {
            switch (type) {
                case "action":
                    switch (title) {
                        case "Stop Likes Task":
                            if (raf) cancelAnimationFrame(raf);
                            if (interId) clearInterval(interId)
                            if (timeOutId) clearTimeout(timeOutId);
                            if (timeOutId || interId) {
                                taskRunning = false;
                                sendResponse({ status: true})
                            }else{
                                sendResponse({ status: false})
                            }
                            break;
                        case "Start Liking":
                            try {
                                likeTaskRecursive(data.maxTime, data.minTime, data.likesLimit);
                                sendResponse({ status: true})
                            } catch (error) {
                                sendResponse({ status: false})
                            }
                            break
                    }
                    break;
                case "data":
                    switch (title) {
                        case "give me task status":
                            sendResponse({
                                taskRunning: taskRunning,
                            });
                            break;
                    }
                    break;
            }
        }
    );
};

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
                            chrome.runtime.sendMessage({ type: "data", title: "Target Like Reached" });
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
