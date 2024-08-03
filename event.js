let Data = {
    "title": "",
    "url": "",
    "date": ""
}

let creating;
var setup = async function() {
    const url = chrome.runtime.getURL("offscreen.html");
    const contexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [url],
    });
    if (contexts.length > 0) {
        return;
    }

    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: url,
            reasons: ["CLIPBOARD"],
            justification: "for clipboard",
        });
        await creating;
        creating = null;
    }
}

var getUrlTitle = async function() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    Data.title = tab.title;
    Data.url = tab.url;
}

var getDate = function() {
    const date = new Date();
    Data.date = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
}

var setMessage = async function() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["style"], (result) => {
            const style = result.style;
            let message = "";
            if (style == "md") {
                message = `[${Data.title}](${Data.url})`;
            } else {
                message = `${Data.title}，${Data.url}，${Data.date}`;
            }
            resolve(message);
        });
    });
}

chrome.action.onClicked.addListener(async() => {
    await setup();
    await getUrlTitle();
    getDate();
    const message = await setMessage();
    await chrome.runtime.sendMessage(message);
    chrome.offscreen.closeDocument();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let sendContent = chrome.tabs.sendMessage(tabs[0].id, { text: message });
        sendContent
            .then(() => console.log("sent"))
            .catch((e) => console.error(e));
    });
})

// インストール時の初期化
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.storage.local.set({ "style": "default" });
    }
})