chrome.runtime.onMessage.addListener(message => {
    text.value = message;
    text.select();
    document.execCommand("copy");
});