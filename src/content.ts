type gloVarType = {
    minTime: number,
    maxTime: number,
    // intervalId: string | NodeJS.Timeout | null,
    intervalId: NodeJS.Timeout | null
}

let gloVar: gloVarType = {
    minTime: 1000,
    maxTime: 3000,
    intervalId: null
}

class RandomInterval {
    minTime: number
    maxTime: number
    isRunning: boolean
    randTime: number
    likesCount: number

    constructor(minTime: number, maxTime: number) {
        this.minTime = minTime
        this.maxTime = maxTime
        this.isRunning = false
        this.randTime = 0
        this.likesCount = 0
    }

    start() {
        console.log("%cLikes Started", "background: #f1f7ff; color: black; padding:10px");

        if (this.checkForLimit() || this.likesCount >= 49) {
            this.stop()
            return
        }
        this.isRunning = true
        const like = new Like()


        if (like.do()) {

            //send the updated likes count to popup
            this.likesCount = this.likesCount + 1
            this.sendUpdateToPopup({ likesCount: this.likesCount })

            this.randTime = Math.floor((Math.random() * (this.maxTime - this.minTime)) + this.minTime)
        } else {
            this.randTime = 0
        }

        gloVar.intervalId = setTimeout(async () => {
            const next = new Next()

            try {
                const result: any = await next.do
                this.start()

            } catch (error) {
                console.log(error);
                this.stop()
            }

        }, this.randTime);
    }

    stop() {
        console.log("%cLikes Stopped", "background: #f1f7ff; color: black; padding:10px");
        
        clearTimeout(gloVar.intervalId as unknown as number)
        gloVar.intervalId = null
    }

    sendUpdateToPopup(message: object) {
        chrome.runtime.sendMessage(message)
    }

    checkForLimit() {
        let dialogs = document.querySelectorAll('div[role="dialog"]')
        if (dialogs[3]) {
            return true
        }
        return false
    }
}

class Like {
    element: SVGAElement | null
    constructor() {
        this.element = document.querySelector('svg[aria-label="Like"][height="24"]')
    }
    do() {
        if (this.element) {
            this.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            return true
        } else {
            return false
        }
    }
}

class Next {
    element: SVGAElement | null
    do: any
    constructor() {
        this.element = document.querySelector('svg[aria-label="Next"]')
        this.do = new Promise((resolve: Function, reject: Function) => {
            if (this.element) {
                this.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                resolve(true)
            } else {
                let i: number = 0
                let check = () => {
                    if (i > 120) {
                        reject("120 frames (2 secs) have passed\n and 'next' element wasnt found,\n therefore :-")
                    }

                    this.element = document.querySelector('svg[aria-label="Next"]')
                    if (!this.element) {
                        i++
                        requestAnimationFrame(check)
                    } else {
                        this.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                        resolve(true)
                    }

                }
                check()
            }
        })
    }
}

//Event Listners
chrome.runtime.onMessage.addListener((reqst, sender, sendResponse) => {
    if (reqst.action == "startStopLikeInterval") {
        const randomInterval = new RandomInterval(gloVar.minTime, gloVar.maxTime)

        if (!gloVar.intervalId) {
            randomInterval.start()
            sendResponse("Started")
        } else {
            randomInterval.stop()
            gloVar.intervalId = null
        }
    }
})
