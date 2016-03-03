# Nodes Module Starter Kit bids you welcome!

Before you get started writing your next Angular Module, you need to set up a few things:

- Come up with an awesome name for your module
- Rename the files in the `src/` folder to your awesome name
- Fill out the information in `package.json` and `bower.json` (name, description, etc.)
- Correct the references in `index.html` to the styles and scripts
- Create a repository for your module on Github

------

When you are ready to release your package to the world follow these simple steps:

- In the gruntfile, make sure to add all your modules to the concat src block (and make sure they are loaded in correct order - look further down for an example)
- Run grunt build to generate release oriented files
- In your index.html file, replace your src files with the dist file, and check that everything works
- Commit & Push

To release your module on bower follow these steps (After building!)

- From the command-line run: `bower release [PACKAGE-NAME] [PACKAGE-GITHUB-URL]`

example: `bower release nCore https://github.com/nodes-galactic/nCore`

Done! You can now run `bower install PACKAGE-NAME` in a project! Yay!

-----

### Concatination Order

This requires a manual setup for each project, as the files needed vary.

1. Module definition
2. Providers
3. Config / Run / Decorators
4. Factories / Services
5. Directives
6. Templates

```javascript
concat: {
	options: {
		banner: '<%= meta.banner %>'
	},
	dist: {
		src: [
			'.tmp/scripts/*.module.js',
			'.tmp/scripts/*.provider.js',
			'.tmp/scripts/*.*.directive.js',
			'.tmp/scripts/templates.js'
		],
		dest: '<%= yeoman.dist %>/<%= pkg.name %>.js'
	}
},
```

-----

### We also recommend doing your fellow developers a few favors:

- Write a guide on how to use your module in the `readme.md` file
- Write a few demo examples so people can see the intended use
- If you want to go all the way, make a Github Pages branch, this will give your module a little home on the web where you can host your demos
