console.log("内容脚本已加载，正在监听...");
const turndownService = new TurndownService();

turndownService.addRule("betterStars", {
  // 优化加粗文本的转换
  filter: ["strong"],
  replacement: function (content) {
    return "**" + content + "**" + " ";
  },
});

turndownService.addRule("betterExample", {
  filter: ["pre"],
  replacement: function (content) {
    // 分割内容为单独的行
    var lines = content.split("\n");
    // 将每行转换为Markdown引用格式
    var blockquoted = lines
      .map(function (line, index) {
        // 检查当前行是否是第一行
        return (index === 0 ? "\n" : "") + "> " + line;
      })
      .join("\n");
    return blockquoted;
  },
});

turndownService.escape = function (text) {
  // 重写escape方法
  return text.replace(/([\\`*{}[\]()#+\-.!_>])/g, function (match, char) {
    // 在这里，我们选择不转义方括号
    if (char === "[" || char === "]") {
      return char;
    }
    return "\\" + char;
  });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("收到消息:", request);
  if (request.action === "getContent") {
    const contentElement = document.querySelector(".elfjS");
    if (contentElement) {
      const markdownContent = turndownService.turndown(contentElement);
      sendResponse({ content: markdownContent });
    } else {
      console.error("找不到指定的元素");
      sendResponse({ content: "元素未找到" });
    }
    return true; // 保持消息通道开放以异步发送响应
  }
});
