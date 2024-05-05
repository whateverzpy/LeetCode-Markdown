// content.js
console.log('内容脚本已加载，正在监听...');

function htmlToMarkdown(html) {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('收到消息:', request);
  if (request.action === "getContent") {
    const contentElement = document.querySelector('.elfjS');
    if (contentElement) {
      const markdown = htmlToMarkdown(contentElement.innerHTML);
      sendResponse({ content: markdown });
    } else {
      console.error('找不到指定的元素');
      sendResponse({ content: '元素未找到' });
    }
    return true; // 保持消息通道开放以异步发送响应
  }
});