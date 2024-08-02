chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Xử lý thông điệp ở đây
    console.log("Received message:", request.text);
});