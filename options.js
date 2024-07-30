// 現在の状態を設定
chrome.storage.local.get(["style"], (result) => {
    document.getElementById(result.style).checked = true;
})

// スタイルを変更
let style = document.getElementById('styleForm');

style.addEventListener('change', (event) => {
    chrome.storage.local.set({ "style": event.target.value });
    console.log(`Change to ${event.target.value} style.`);
    chrome.storage.local.get(["style"], (result) => {
        console.log(result.style);
    })
})