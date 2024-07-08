# Mergy

Mergy is a Browser extension designed to easily aggregate GitHub repository contents into a single text file, perfect for use with Anthropic's Claude Projects feature, enabling seamless integration of entire codebases for AI-assisted development and analysis.

## Features

- Fetch files from any public GitHub repository
- Customizable file inclusion/exclusion rules
- Combine selected files into a single, downloadable text file
- Respect .gitignore rules and support custom ignore patterns
- User-friendly interface with file size estimates and selection options

## Installation

1. Download the extension from the Browser Web Store (link to be added once published)
2. Click on "Add to Browser" to install the extension
3. Once installed, you'll see the Mergy icon in your Chrome toolbar

## Usage

1. Navigate to any GitHub repository page
2. Click on the Mergy icon in your Chrome toolbar
3. Set your GitHub Personal Access Token in the settings (required for API access)
4. Configure Mergy Ignore rules if desired (optional)
5. Click "Start Fetching Files" to retrieve the repository contents
6. Select the files you want to include in the combined file
7. Click "Download Combined Files" to generate and download the aggregated text file

## Configuration

### GitHub Token

To use this extension, you need to provide a GitHub Personal Access Token:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new read-only token with 'repo' scope
3. Copy the token and paste it into the extension's settings

### MergyIgnore Rules

You can customize which files to include or exclude using MergyIgnore rules:

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

Developed by Betalgo with ❤️ for Anthropic's Claude