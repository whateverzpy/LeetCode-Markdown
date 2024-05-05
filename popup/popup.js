// popup.js
document.getElementById('convert').addEventListener('click', function () {
  console.log('点击了转换按钮');
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getContent" }, function (response) {
      if (chrome.runtime.lastError) {
        // 在此处理错误，例如显示消息给用户
        console.error('发生错误:', chrome.runtime.lastError.message);
        return;
      }
      document.getElementById('result').value = response.content;
    });
  });
});