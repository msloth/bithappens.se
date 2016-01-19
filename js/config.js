$(function() {

	CMS.init({

		// Name of your site or location of logo file ,relative to root directory (img/logo.png)
		siteName: 'Bithappens',

		// Tagline for your site
		siteTagline: 'Another one bit the dust',

		// Email address
		siteEmail: 'linderoth.marcus@gmail.com',

		// Name
		siteAuthor: 'Marcus Linderoth',

		// Navigation items
		siteNavItems: [
			{ name: 'Github', href: 'https://github.com/msloth', newWindow: true},
			{ name: 'About'}
		],

		// Posts folder name
		postsFolder: 'posts',

		// Homepage posts snippet length
		postSnippetLength: 120,

		// Pages folder name
		pagesFolder: 'pages',

		// Site fade speed
		fadeSpeed: 300,

		// Site footer text
		footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',

		// Mode 'Github' for Github Pages, 'Apache' for Apache server. Defaults
		// to Github
		mode: 'Github',

		// If Github mode is set, your Github username and repo name. Defaults
		// to Github pages branch (gh-pages)
		githubUserSettings: {
			username: 'msloth',
			repo: ''
		}

	});

	// Markdown settings
	marked.setOptions({
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false
	});

});
