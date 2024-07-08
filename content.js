chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getRepoInfo") {
        const repoInfo = extractRepoInfo();
        sendResponse({repo: repoInfo});
    }
});

function extractRepoInfo() {
    const repoElement = document.querySelector('meta[name="octolytics-dimension-repository_nwo"]');
    if (repoElement) {
        const [owner, name] = repoElement.content.split('/');
        return { owner, name };
    }
    return null;
}
