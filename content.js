chrome.runtime.onMessage.addListener(message => {
    console.log(`Copied: ${message}`);

    const messageElement = document.createElement("div");
    messageElement.textContent = `コピーしました！`;
    messageElement.style.backdropFilter = "blur(10px)";
    messageElement.style.background = "rgba(200, 240, 240, 0.75)";
    messageElement.style.border = "1px solid #acc";
    messageElement.style.borderRadius = "5px";
    messageElement.style.fontWeight = "bold";
    messageElement.style.padding = "10px";
    messageElement.style.position = "fixed";
    messageElement.style.right = "10px";
    messageElement.style.top = "10px";
    messageElement.style.zIndex = "99999";
    document.body.appendChild(messageElement);

    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 3000);
});