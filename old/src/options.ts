
function changeState(element: HTMLInputElement) {
    let prnt = element.parentElement;
    let p = prnt?.querySelector(".State") as HTMLParagraphElement;
    let pPrnt = prnt?.parentElement
    let numberIn = pPrnt?.querySelector(".numberIn") as HTMLInputElement;

    if (element.checked == true) {
        p.innerText = "On";
        numberIn.style.display = "block";
    }else {
        p.innerText = "Off";
        numberIn.style.display = "none";
    }
}
const saveOptions = () => {
    let inputs = document.querySelectorAll("input");
    let data: { [key: string]: any } = {};

    inputs.forEach((e) => {
        if (e.type == "checkbox") {
            data[e.id] = e.checked;
        }else if(e.type == "number"){
            data[e.id] = e.value;
        }
    });

    chrome.storage.sync.set({ instagramLikerOptions: data });
};

const restoreOptions = () => {
    chrome.storage.sync.get("instagramLikerOptions", (result) => {
        const options = result.instagramLikerOptions;
        if (options) {
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    const value = options[key];
                    const element = document.getElementById(key) as HTMLInputElement    ;

                    if (element) {
                        if (element.type === "checkbox") {
                            (element as HTMLInputElement).checked = value;
                        } else if (element.type === "number") {
                            (element as HTMLInputElement).value = value;
                        }

                        changeState(element as HTMLInputElement);
                    }
                }
            }
        }
    });
};

let inputs = document.querySelectorAll("input");

inputs.forEach((e) => {
    e.addEventListener("input", () => {
        changeState(e as HTMLInputElement);
        saveOptions();
        console.log(e.id);
    });
});
document.addEventListener("DOMContentLoaded", restoreOptions);
