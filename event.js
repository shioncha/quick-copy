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

var getDate = async function() {
    const date = new Date();
    Data.date = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
}

chrome.action.onClicked.addListener(async() => {
    await setup();
    await getUrlTitle();
    await getDate();
    const message = Data.title + "，" + Data.url + "，" + Data.date;
    await chrome.runtime.sendMessage(message);
    chrome.offscreen.closeDocument();
})