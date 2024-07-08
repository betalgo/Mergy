document.addEventListener('DOMContentLoaded', function() {
    const repoInfoElement = document.getElementById('repo-info');
    const githubTokenInput = document.getElementById('github-token');
    const saveTokenButton = document.getElementById('save-token');
    const startFetchButton = document.getElementById('start-fetch');
    const fileTableBody = document.getElementById('file-table-body');
    const downloadFilesButton = document.getElementById('download-files');
    const settingsToggleButton = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const saveRulesButton = document.getElementById('save-rules');
    const downloadSection = document.getElementById('download-section');
    const estimatedSizeSpan = document.getElementById('estimated-size');
    const fileList = document.getElementById('file-list');
    const loadingIndicator = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');

    const mergyignoreInputs = {
        includePath: document.getElementById('include-path'),
        includeExtension: document.getElementById('include-extension'),
        excludePath: document.getElementById('exclude-path'),
        excludeExtension: document.getElementById('exclude-extension')
    };

    let currentRepo = null;
    let fetchedFiles = [];

    // Load saved token and check if settings should be shown
    chrome.storage.sync.get(['githubToken', 'mergyignoreRules'], function(result) {
        if (result.githubToken) {
            githubTokenInput.value = result.githubToken;
            settingsPanel.style.display = 'none';
        } else {
            settingsPanel.style.display = 'block';
        }
    
        if (result.mergyignoreRules) {
            const rules = JSON.parse(result.mergyignoreRules);
            mergyignoreInputs.includePath.value = rules.includePath.join('\n');
            mergyignoreInputs.includeExtension.value = rules.includeExtension.join('\n');
            mergyignoreInputs.excludePath.value = rules.excludePath.join('\n');
            mergyignoreInputs.excludeExtension.value = rules.excludeExtension.join('\n');
        } else {
            // Set default exclude rules
            mergyignoreInputs.excludePath.value = 'bin\nobj\nnode_modules\nbuild\ndist\n.git';
            mergyignoreInputs.excludeExtension.value = '.jpg\n.jpeg\n.png\n.gif\n.bmp\n.tiff\n.ico\n.svg\n.webp\n.mp4\n.avi\n.mov\n.wmv\n.flv\n.ogg\n.mp3\n.wav\n.flac\n.pdf\n.doc\n.docx\n.xls\n.xlsx\n.ppt\n.pptx\n.zip\n.rar\n.tar\n.gz\n.7z\n.exe\n.dll\n.so\n.dylib\n.class\n.pyc\n.pyo\n.o\n.obj\n.lib\n.a\n.jar\n.war\n.ear\n.db\n.sqlite\n.sqlite3\n.mdf\n.ldf\n.bak\n.tmp\n.temp\n.swp\n.DS_Store\n.lock\n.log';
        }
    });

    // Toggle settings panel
    settingsToggleButton.addEventListener('click', function() {
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
            mainContent.style.display = 'none';
            fileList.style.display = 'none';
            downloadFilesButton.style.display = 'none';
            clearFetchedFiles();
        } else {
            settingsPanel.style.display = 'none';
            mainContent.style.display = 'block';
        }
    });

    function clearFetchedFiles() {
        fetchedFiles = [];
        fileTableBody.innerHTML = '';
        estimatedSizeSpan.textContent = '';
    }

    // Save token
    saveTokenButton.addEventListener('click', function() {
        const token = githubTokenInput.value.trim();
        if (token) {
            chrome.storage.sync.set({githubToken: token}, function() {
                chrome.runtime.sendMessage({action: 'setToken', token: token}, function(response) {
                    if (response && response.success) {
                        alert('GitHub token saved and set!');
                    } else {
                        alert('Error setting token in background script.');
                    }
                });
            });
        } else {
            alert('Please enter a valid GitHub token.');
        }
    });

    // Save MergyIgnore rules
    saveRulesButton.addEventListener('click', function() {
        const rules = {
            includePath: mergyignoreInputs.includePath.value.split('\n').filter(Boolean),
            includeExtension: mergyignoreInputs.includeExtension.value.split('\n').filter(Boolean),
            excludePath: mergyignoreInputs.excludePath.value.split('\n').filter(Boolean),
            excludeExtension: mergyignoreInputs.excludeExtension.value.split('\n').filter(Boolean)
        };
        chrome.storage.sync.set({mergyignoreRules: JSON.stringify(rules)}, function() {
            alert('MergyIgnore rules saved!');
        });
    });



    // Display files in the table
    function displayFiles(files) {
        fileTableBody.innerHTML = '';
        files.forEach(file => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" checked data-path="${file.path}"></td>
                <td>${formatFileSize(file.size)}</td>
                <td title="${file.name}">${file.name}</td>
                <td title="${file.path}">${file.path}</td>
            `;
            row.querySelector('input[type="checkbox"]').addEventListener('change', updateEstimatedSize);
            fileTableBody.appendChild(row);
        });
    }

    // Update estimated size
    function updateEstimatedSize() {
        const selectedFiles = Array.from(fileTableBody.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => fetchedFiles.find(file => file.path === checkbox.dataset.path));
        const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        estimatedSizeSpan.textContent = `Estimated size: ${formatFileSize(totalSize)}`;
    }

    // Download combined files
startFetchButton.addEventListener('click', function() {
    if (!currentRepo) {
        alert('No repository detected. Please navigate to a GitHub repository page.');
        return;
    }

    showLoading(true);
    fileList.style.display = 'none';
    downloadFilesButton.style.display = 'none';
    clearFetchedFiles();

    chrome.storage.sync.get(['githubToken', 'mergyignoreRules'], function(result) {
        if (!result.githubToken) {
            showLoading(false);
            alert('GitHub token not set. Please set your Personal Access Token in the settings.');
            return;
        }

        let rules;
        try {
            rules = result.mergyignoreRules ? JSON.parse(result.mergyignoreRules) : {};
        } catch (e) {
            console.error('Error parsing MergyIgnore rules:', e);
            rules = {};
        }

        // Ensure all rule arrays exist
        rules.includePath = rules.includePath || [];
        rules.includeExtension = rules.includeExtension || [];
        rules.excludePath = rules.excludePath || [];
        rules.excludeExtension = rules.excludeExtension || [];

        chrome.runtime.sendMessage({
            action: 'fetchFiles',
            repo: currentRepo,
            mergyignoreRules: rules,
            token: result.githubToken
        }, function(response) {
            showLoading(false);
            if (response.error) {
                alert(`Error: ${response.error}`);
            } else if (response.files) {
                fetchedFiles = response.files;
                displayFiles(fetchedFiles);
                updateEstimatedSize();
                fileList.style.display = 'block';
                downloadFilesButton.style.display = 'inline-flex';
            }
        });
    });
});

    // Download combined files
    downloadFilesButton.addEventListener('click', function() {
        showLoading(true);
        const selectedFiles = Array.from(fileTableBody.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.dataset.path);

        chrome.runtime.sendMessage({
            action: 'downloadFiles',
            repo: currentRepo,
            files: selectedFiles
        }, function(response) {
            showLoading(false);
            if (response.error) {
                alert(`Error: ${response.error}`);
            } else if (response.content) {
                const blob = new Blob([response.content], {type: 'text/plain'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${currentRepo.owner}_${currentRepo.name}_combined.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    });

    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
        startFetchButton.disabled = show;
        downloadFilesButton.disabled = show;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Load repository information
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getRepoInfo"}, function(response) {
            if (response && response.repo) {
                currentRepo = response.repo;
                repoInfoElement.textContent = `Repository: ${currentRepo.owner}/${currentRepo.name}`;
            }
        });
    });
});