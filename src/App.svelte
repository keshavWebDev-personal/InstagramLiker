<script lang="ts">
    // let likesCount = 0;
    // let likesLimit = 50;
    // let taskRunning = false;

    // async function handleClick() {
    //     if (taskRunning) {
    //         // A Message to Service Worker to Stop the Task Loop wiith
    //         chrome.runtime.sendMessage({
    //             type: "action",
    //             title: "Stop Liking",
    //         });
    //     } else {
    //         // A Messgae to Service WOrker to Start the Task Loop
    //         // Max time, Min Time, Likes Limit
    //         await chrome.runtime.sendMessage({
    //             type: "action",
    //             title: "Start Liking",
    //             maxTime: 3000,
    //             minTime: 1000,
    //             likesLimit: likesLimit,
    //         });
    //     }

    //     // Flipping the boolean
    //     taskRunning = !taskRunning;
    // }
    // chrome.runtime.onMessage.addListener(({ type, title, ...data }) => {
    //     // Data Related Messages
    //     if (type === "data") {
    //         if (title == "Like Count") {
    //             likesCount = data.data;
    //         } else if (title == "Target Like Reached") {
    //             taskRunning = false;
    //         } else if (title == "reached end of page") {
    //             taskRunning = false;
    //         }
    //     }
    // });

    // window.onload = async () => {
    //     const { likes } = await chrome.runtime.sendMessage({
    //         type: "data",
    //         title: "give me likes count",
    //     });
    //     likesCount = likes;

    //     let [tab] = await chrome.tabs.query({ active: true });
    //     if (!tab || !tab.id) {
    //         console.log("Tab not found");
    //         return;
    //     }
    //     let res = await chrome.tabs.sendMessage(tab.id, {
    //         type: "data",
    //         title: "give me task status",
    //     });
    //     taskRunning = res.taskRunning;
    // };
</script>

<main class="p-4 bg-gradient-to-r from-[#3A3647] bg-gradient-to-[#624F4F] w-full h-full  ">
    
    <div class="w-full flex flex-col  ">
        <div class="m-auto ">
        </div>
    </div>
</main>

<style>
    :global(body) {
        width: 250px;
    }
</style>
