var beta = {
	npm: {
		tag: 'beta'
	}
}
module.exports = {
	git: {
		tagName: "${ version }-beta",
		commitMessage: "chore: release %s",
		requireCleanWorkingDir: false
	},
	github: {
		release: true
	},
	npm: {
		release: false
	},
	preRelease: 'beta'
}