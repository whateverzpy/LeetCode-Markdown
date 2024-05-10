// popup.js
document.getElementById("convert").addEventListener("click", function () {
  console.log("点击了转换按钮");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getContent" },
      function (response) {
        document.getElementById("result").value = response.content;
      }
    );
  });
});
