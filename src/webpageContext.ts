export function webpageContext() {
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
    
    function stopLikeTask() {
        if (raf) cancelAnimationFrame(raf);
        if (interId) clearInterval(interId)
        if (timeOutId) clearTimeout(timeOutId);
    }

    let likeTaskRecursive = async (maxTime: number, minTime: number) => {
        // A Check for Insta Saying STOP IT! via a Dialog on the UI
        let [,,,dialog] = document.querySelectorAll('div[role="dialog"]');
        if (dialog) {
            chrome.runtime.sendMessage({
                type: "info",
                title: "reached instagram like limit",
            });
            stopLikeTask()
            taskRunning = false;
            return
        };

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
                likeTaskRecursive(maxTime, minTime)                
            } catch (error) {
                console.log(error);
                chrome.runtime.sendMessage({
                    type: "info",
                    title: "reached end of page",
                });
                stopLikeTask()
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
                            stopLikeTask()
                            if (timeOutId || interId) {
                                taskRunning = false;
                                sendResponse({ status: true})
                            }else{
                                sendResponse({ status: false})
                            }
                            break;
                        case "Start Liking":
                            try {
                                likeTaskRecursive(data.maxTime, data.minTime);
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