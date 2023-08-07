module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy('cubi.st/public');
	eleventyConfig.addPassthroughCopy({ 'cubi.st/robots.txt': '/robots.txt' });
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.setServerOptions({
		// liveReload: false,
		watch: [
			'cubi.st/public/**/*',
		],
		showVersion: true,
	});

	return {
		dir: {
			includes: "_includes",
			layouts: "_layouts",
		}
	}
};
