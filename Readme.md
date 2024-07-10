# Mergy

Mergy is a browser extension that combines and optimizes GitHub repository contents into a single text file. It's designed to work with Claude, an AI assistant.

## Links:
- [Youtube video](https://www.youtube.com/watch?v=4gbvmFCAN0E) 
- [Blog Post](https://blog.kayhantolga.com/mergy-a-quick-tool-for-claude-projects)
- [Mergy Client App](https://github.com/betalgo/MergyClient)

## What does Mergy do?

1. When you visit a GitHub repository, Mergy can fetch all the files.
2. It combines these files into one text document.
3. The extension optimizes the content to use fewer tokens, which is important for AI processing.
4. You can then upload this combined file to [Claude Projects](https://claude.ai/projects).

## How can developers use it?

- Visit a small to medium-sized library on GitHub.
- Use Mergy to create a single file containing all the code.
- Upload this file to [Claude Projects](https://claude.ai/projects).
- Now you can ask Claude questions about the entire codebase or request it to generate code based on the library.

This tool helps developers quickly give Claude context about an entire codebase, making it easier to work with AI on programming tasks.

## Features

- Fetch files from any public GitHub repository
- Customizable file inclusion/exclusion rules
- Combine selected files into a single, downloadable text file
- Respect .gitignore rules and support custom ignore patterns
- User-friendly interface with file size estimates and selection options

## Installation

1. Download the extension from your browser's extension store (links to be added once published)
2. Click on "Add to [Your Browser Name]" to install the extension
3. Once installed, you'll see the Mergy icon in your browser toolbar

## Usage

1. Navigate to any GitHub repository page
2. Click on the Mergy icon in your browser toolbar
3. Set your GitHub Personal Access Token in the settings (required for API access)
4. Configure Mergy Ignore rules if desired (optional)
5. Click "Start Fetching Files" to retrieve the repository contents
6. Select the files you want to include in the combined file
7. Click "Combine and Download" to generate and download the aggregated text file

## Configuration

### GitHub Token

To use this extension, you need to provide a GitHub Personal Access Token:

1. Go to GitHub Settings > Developer settings > [Personal access tokens](https://github.com/settings/tokens?type=beta)
2. Generate a new token with 'repo' scope
3. Copy the token and paste it into the extension's settings

### Mergy Ignore Rules

You can customize which files to include or exclude using Mergy Ignore rules:

- Include if path contains: Specify paths to include
- Include file extensions: List file extensions to include
- Exclude if path contains: Specify paths to exclude
- Exclude file extensions: List file extensions to exclude

## Privacy and Security

This extension requires a GitHub Personal Access Token to function. Your token is stored locally in your browser and is only used to authenticate API requests to GitHub. We do not collect or store any personal data.

## Support

For bug reports, feature requests, or general questions, please open an issue on our GitHub repository (link to be added).

## Contributing

We welcome contributions to the Mergy project. Please read our contributing guidelines (link to be added) before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed by [Betalgo](https://betalgo.com/) with ❤️ for [Anthropic](https://www.anthropic.com/)'s [Claude](https://claude.ai/)