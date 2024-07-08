const API_BASE_URL = 'https://api.github.com';
let githubToken = '';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'setToken') {
        githubToken = request.token;
        sendResponse({success: true});
    } else if (request.action === 'fetchFiles') {
        githubToken = request.token;  // Set the token from the message
        fetchRepoFiles(request.repo, request.mergyignoreRules)
            .then(files => sendResponse({files: files}))
            .catch(error => sendResponse({error: error.message}));
        return true;
    } else if (request.action === 'downloadFiles') {
        combineAndDownloadFiles(request.repo, request.files)
            .then(content => sendResponse({content: content}))
            .catch(error => sendResponse({error: error.message}));
        return true;
    }
});

async function fetchRepoFiles(repo, mergyignoreRules) {
    if (!githubToken) {
        throw new Error('GitHub token not set. Please set your Personal Access Token.');
    }
    const files = await listRepoContents(repo, '', mergyignoreRules);
    return files.sort((a, b) => b.size - a.size);
}



async function listRepoContents(repo, path = '', mergyignoreRules) {
    const url = `${API_BASE_URL}/repos/${repo.owner}/${repo.name}/contents/${path}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${githubToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const contents = await response.json();
    let files = [];

    for (const item of contents) {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        
        if (shouldIncludeFile(fullPath, item.name, mergyignoreRules)) {
            if (item.type === 'file') {
                files.push({
                    name: item.name,
                    path: fullPath,
                    size: item.size,
                    downloadUrl: item.download_url
                });
            } else if (item.type === 'dir') {
                const subFiles = await listRepoContents(repo, fullPath, mergyignoreRules);
                files = files.concat(subFiles);
            }
        }
    }

    return files;
}

function shouldIncludeFile(fullPath, fileName, rules) {
    const extension = '.' + fileName.split('.').pop();

    // Ensure all rule arrays exist, if not, create empty arrays
    rules.includePath = rules.includePath || [];
    rules.includeExtension = rules.includeExtension || [];
    rules.excludePath = rules.excludePath || [];
    rules.excludeExtension = rules.excludeExtension || [];

    // Check include rules
    if (rules.includePath.length > 0 || rules.includeExtension.length > 0) {
        const pathIncluded = rules.includePath.length === 0 || rules.includePath.some(path => fullPath.includes(path));
        const extensionIncluded = rules.includeExtension.length === 0 || rules.includeExtension.includes(extension);
        if (!pathIncluded || !extensionIncluded) {
            return false;
        }
    }

    // Check exclude rules
    if (rules.excludePath.some(path => fullPath.includes(path))) {
        return false;
    }
    if (rules.excludeExtension.includes(extension)) {
        return false;
    }

    return true;
}


function parseMergyIgnoreRules(rulesString) {
    return rulesString.split('\n')
        .map(rule => rule.trim())
        .filter(rule => rule && !rule.startsWith('#'))
        .map(rule => new RegExp(rule.replace(/\*/g, '.*').replace(/\?/g, '.'), 'i'));
}

function shouldIgnore(path, ignorePatterns) {
    return ignorePatterns.some(pattern => pattern.test(path));
}

async function combineAndDownloadFiles(repo, files) {
    // Implement file combination and download
    // This is a placeholder and needs to be implemented
    console.log('Combining and downloading files:', files);
    return 'download_url_placeholder';
}
async function combineAndDownloadFiles(repo, filePaths) {
    let combinedContent = '';
    
    for (const filePath of filePaths) {
        const fileContent = await fetchFileContent(repo, filePath);
        combinedContent += `// File: ${filePath}\n`;
        combinedContent += fileContent;
        combinedContent += '\n\n';
    }
    
    const optimizedContent = optimizeWhitespace(combinedContent);
    
    // Instead of creating a Blob and URL here, we'll return the content
    return optimizedContent;
}

async function fetchFileContent(repo, filePath) {
    const url = `${API_BASE_URL}/repos/${repo.owner}/${repo.name}/contents/${filePath}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'Authorization': `token ${githubToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }

    return await response.text();
}

function optimizeWhitespace(content) {
    const lines = content.split('\n');
    const optimizedLines = [];
    let previousLineEmpty = false;

    for (let line of lines) {
        // Trim trailing whitespace
        line = line.trimEnd();
        
        // Remove leading whitespace, but keep a single space for indentation if present
        const indent = line.match(/^\s+/);
        if (indent) {
            line = ' ' + line.trimStart();
        }
        
        if (line === '') {
            if (!previousLineEmpty) {
                optimizedLines.push('');
                previousLineEmpty = true;
            }
        } else {
            optimizedLines.push(line);
            previousLineEmpty = false;
        }
    }

    return optimizedLines.join('\n');
}


async function combineAndDownloadFiles(repo, filePaths) {
    let combinedContent = '';
    
    for (const filePath of filePaths) {
        const fileContent = await fetchFileContent(repo, filePath);
        combinedContent += `// File: ${filePath}\n`;
        combinedContent += fileContent;
        combinedContent += '\n\n';
    }
    
    return optimizeWhitespace(combinedContent);
}