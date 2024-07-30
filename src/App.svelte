<script lang="ts">
    let likesCount = 100;
    let likesLimit = 50;
    let taskRunning = false;

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

<main class=" relative -z-2 px-5.5 bg-gradient-to-r from-[#3A3647] to-[#624F4F] w-full h-full  ">
    
    <div class="w-full flex flex-col pt-6">
        <div class=" text-[0.7rem] font-bold text-gray-3 relative m-auto w-[40%] text-center bg-gradient-to-r from-[#74545C] to-[#91687B] rounded-t-lg h-min leading-snug before:( -z-1 content-[''] w-4 h-4 bg-transparent absolute right-full rounded-br-full bottom-0 border-b-10 border-r-10 -mr-10px -mb-10px border-#74545C) after:(-z-1 content-[''] w-4 h-4 bg-transparent absolute left-full rounded-bl-full bottom-0 border-b-10 border-l-10 -ml-10px -mb-10px border-#91687B) ">
            Total Likes
        </div>
        <div class=" px-2 py-1 flex bg-gradient-to-r from-[#604646] to-[#A67792] w-full rounded-2xl font-bold items-center ">
            <div class=" relative *:size-10 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="color-#E65848/30 ">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" color-#E65848 -mt-7">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" color-#E65848/30 -mt-7">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
            </div>
            <p class="text-center w-full  text-3.5rem leading-none " >{likesCount}</p>
        </div>
    </div>
</main>

<style>
    :global(body) {
        width: 250px;

    }
</style>
