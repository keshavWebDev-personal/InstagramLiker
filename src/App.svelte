<script lang="ts">
    let likesCount = 0;
    let likesLimit = 50;
    let taskRunning = false;
    let elements: Array<number> = [];

    $: {
        if (likesCount > 0) {
            elements = [...elements, likesCount];
        }
    }
    async function handleClick() {
        if (taskRunning) {
            let {status} = await chrome.runtime.sendMessage({
                type: "action",
                title: "Stop Liking",
            });
            taskRunning = !status;

        } else {
            chrome.runtime.sendMessage({
                type: "action",
                title: "Start Liking",
                maxTime: 3000,
                minTime: 1000,
                likesLimit: likesLimit,
            });
            taskRunning = true;
        }
    }
    chrome.runtime.onMessage.addListener(({ type, title, ...data }) => {
        switch (type) {
            case "data":
                switch (title) {
                    case "Like Count":
                        likesCount = data.data;
                        break;
                }
                break;
            case "info":
                switch (title) {
                    case "reached instagram like limit":
                        taskRunning = false;
                        break;
                    case "reached end of page":
                        taskRunning = false;
                        break;
                    case "Target Like Reached":
                        taskRunning = false;
                        break;
                }
                break;
        }
    });

    window.onload = async () => {
        // Getting Likes Count and Likes Limit from Service Worker
        const res1 = await chrome.runtime.sendMessage({ type: "data", title: "give me likes count" });
        const res2 = await chrome.runtime.sendMessage({ type: "data", title: "give me likes limit" });
        
        if (!res1.failed) likesCount = res1.likes;
        if (!res2.failed) likesLimit = res2.likesLimit;
        
        // Getting Task Status from the Current Tab
        let [tab] = await chrome.tabs.query({active: true})
        if (!tab || !tab.id) { console.log("Tab not found"); return};
        try {
            let res = await chrome.tabs.sendMessage(tab.id, {type: "data", title: "give me task status",})
            taskRunning = res.taskRunning
        } catch (error) {
        }

    };

    function onLikeLimitChange() {        
        chrome.runtime.sendMessage({
            type: "data",
            title: "Updated Likes Limit",
            likesLimit: likesLimit,
        })
    }
</script>

<main
    class=" relative px-5.5 py-5.5 bg-gradient-to-r from-[#3A3647] to-[#624F4F] w-full h-full font-sans flex flex-col gap-4"
>
    <div class="w-full flex flex-col">
        <div
            class=" text-[1rem] font-bold text-gray-3 relative m-auto px-3 text-center bg-gradient-to-r from-[#74545C] to-[#91687B] rounded-t-lg h-min leading-snug before:( content-[''] w-4 h-4 bg-transparent absolute right-full rounded-br-full bottom-0 border-b-10 border-r-10 -mr-10px -mb-10px border-#74545C) after:( content-[''] w-4 h-4 bg-transparent absolute left-full rounded-bl-full bottom-0 border-b-10 border-l-10 -ml-10px -mb-10px border-#91687B) z-10"
        >
            Total Likes
        </div>
        <div
            class=" z-10 px-3 py-1 flex bg-gradient-to-r from-[#604646] to-[#A67792] w-full rounded-2xl items-center h-22"
        >
            <div class=" relative *:size-11 ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="color-#E65848/30"
                >
                    <path
                        d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                    />
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class=" color-#E65848 -mt-7"
                >
                    <path
                        d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                    />
                </svg>
                {#each elements as element (element)}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="top-22% -translate-y-50% absolute animate-ping animate-count-1 opacity-0 transform-origin-center color-#E65848"
                    >
                    <path
                        d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                    />
                    </svg>
                {/each}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class=" color-#E65848/30 -mt-7"
                >
                    <path
                        d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                    />
                </svg>
            </div>
            <div class="text-center w-full text-4rem leading-none font-extrabold">
                <div class="z-10 relative leading-none w-min m-auto" >
                    {likesCount}
                    <div
                        class:block={!taskRunning && likesCount > 0}
                        class:hidden={taskRunning || likesCount == 0 || likesCount < likesLimit}
                        class="top-0 left-0 text-4rem leading-none font-extrabold  absolute text-success -z-1 animate-ping blur-sm  "
                    >
                        {likesCount}
                    </div>
                </div>
                
            </div>
            
        </div>
    </div>
    <div
        class=" px-3 py-2 h-22 flex bg-gradient-to-r from-[#3E446B] to-[#A67792] w-full rounded-2xl flex-col justify-between *:leading-none"
    >
        <div class="text-[0.7rem] text-gray-300">Status</div>
        <div class="text-4xl -mt-1 font-bold"
            class:animate-pulse={taskRunning}
            class:text-success={taskRunning}
            class:text-info={!taskRunning}        
        >
            {taskRunning ? "Working" : "Resting"}
        </div>
        <div class="text-[0.7rem] text-gray-300">On Current Page</div>
    </div>
    <button
        class="mt-4 w-20 mx-auto btn btn-outline rounded-2xl"
        on:click={handleClick}
        class:btn-success={!taskRunning}
        class:bg-[#485244]={!taskRunning}
        class:btn-error={taskRunning}
        class:bg-[#583e3d]={taskRunning}
        disabled={likesLimit <= likesCount}
        
    >
        {taskRunning ? "Stop" : "Start"}
    </button>
    <label class="form-control w-full max-w-xs">
        <div class="label">
            <span class="label-text ml-2">Likes Limit</span>
            <div
                class="badge badge-success gap-2 animate-pulse"
                class:block={likesLimit <= likesCount}
                class:hidden={likesLimit > likesCount}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block h-4 w-4 stroke-current"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
                Reached
            </div>
        </div>
        <input
            type="text"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
            bind:value={likesLimit}
            disabled={taskRunning}
            on:input={onLikeLimitChange}
        />
    </label>
</main>

<style>
    :global(body) {
        width: 300px;
    }
</style>
