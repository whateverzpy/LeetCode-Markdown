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

document.addEventListener("DOMContentLoaded", () => {
  const resultTextarea = document.getElementById("result");
  const copyButton = document.getElementById("copy");

  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    // 选中文本并复制到剪切板
    resultTextarea.select();
    document.execCommand("copy");

    // 修改按钮状态为 ✅
    copyButton.innerHTML = `
      <img src="../icons/Check.svg" alt="check" width="18px" />
    `;

    // 2秒后恢复原始状态
    setTimeout(() => {
      copyButton.innerHTML =
        '<img src="../icons/Copy.svg" alt="copy" width="18px" />';
    }, 2000);
  });
});
