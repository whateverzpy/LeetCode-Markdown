// content.js
console.log("内容脚本已加载，正在监听...");
const turndownService = new TurndownService();

turndownService.addRule("betterStars", {
	// 优化加粗文本的转换
	filter: ["strong", "b"],
	replacement: function (content) {
		return "**" + content + "**" + " ";
	},
});

turndownService.addRule("betterExample", {
	// 优化引用文本的转换
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

turndownService.addRule("betterSup", {
	// 优化上标文本的转换
	filter: ["sup"],
	replacement: function (content) {
		return "^" + content;
	},
});

turndownService.addRule("betterSub", {
	// 优化下标文本的转换
	filter: ["sub"],
	replacement: function (content) {
		return "_" + content;
	},
});

turndownService.escape = function (text) {
	// 重写escape方法
	return text.replace(
		/([\\`*{}[\]()#+\-.!_>])|("\*")/g,
		function (match, char, quotedAsterisk) {
			// 如果匹配到被引号包围的星号，转义它
			if (quotedAsterisk) {
				return '"\\*"';
			}

			// 如果匹配到后方括号，不转义
			if (char === "]") {
				return char;
			}

			// 不转义单独的星号
			if (char === "*") {
				return char;
			}

			// 其他情况下，正常转义字符
			return "\\" + char;
		}
	);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("收到消息:", request);
	if (request.action === "getContent") {
		const contentElement = document.querySelector(".elfjS");
		if (contentElement) {
			const markdownContent = turndownService.turndown(contentElement);
			var title = "#" + " " + document.title.split("-")[0] + "\n\n";
			sendResponse({ content: title + markdownContent });
		} else {
			console.error("找不到指定的元素");
			sendResponse({ content: "元素未找到" });
		}
		return true; // 保持消息通道开放以异步发送响应
	}
});
