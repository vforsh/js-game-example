module.exports = function(grunt) {

	grunt.initConfig({

		clean: {
			main: {
				src: ["../deploy/*", "!../deploy/index.html"],
				options: { force: true }
			},

			kim: {
				src: ["../kim/*", "!../kim/index.html", "!../kim/kim.manifest.json" ],
				options: { force: true }
			}
		},

		uglify: {
			game: {
				options: {
					compress: {
						drop_console: true, // disable for debug purposes
						loops: true,
						dead_code: true,
						unused: true,
						conditionals: true,
						warnings: true
					},
					banner: "'use strict';",
					screwIE8: true
				},
				files: { "../deploy/js/game.min.js": ["../dev/js/game.js"] }
			},
			phaser: {
				files: { "../deploy/js/phaser-no-physics.min.js": ["../dev/js/phaser-no-physics.js"] }
			}
		},

		copy: {
			main: {
				files: [{
					expand: true,
					cwd: "../dev/",
					src: [
						"**", "!index.html",
						"!js/*", "js/detect.min.js", "js/lodash.min.js",
						"!assets/graphics/*.png", "!assets/graphics/compressed/**",
						"assets/graphics/letters_1.png", "assets/graphics/letters_2.png"
					],
					dest: "../deploy/"
				}]
			},

			kim: {
				files: [{
					expand: true,
					cwd: "../deploy/",
					src: ["**", "!index.html"],
					dest: "../kim/"
				}]
			},

			graphics: {
				files: [{
					expand: true,
					cwd: "../dev/assets/graphics/compressed/",
					src: ["*.png"],
					dest: "../deploy/assets/graphics/"
				}]
			},

			charset: {
				files: [{
					expand: true,
					cwd: "../dev/assets/graphics/",
					src: ["**.json"],
					dest: "../dev/assets/graphics/"
				}],
				options: {
					process: function (content, srcpath) {
						var buffer = grunt.file.read(srcpath, {encoding: null});
						if (buffer[0] === 255) { // utf16le
							return buffer.toString('utf16le');
						} else {
							return content;
						}
					}
				}
			}
		},

		tinypng: {
			options: {
				apiKey: "liosANofq2io2ge_KfERTe5ImtYCBhRQ",
				checkSigs: true,
				sigFile: '../dev/assets/graphics/compressed/_file_sigs.json',
				sigFileSpace: 1,
				summarize: true,
				stopOnImageError: true
			},
			compress: {
				cwd: '../dev/assets/graphics/',
				src: ['*.png', '!letters_1.png', '!letters_2.png'],
				dest: '../dev/assets/graphics/compressed/',
				expand: true
			}
		},

		secret: grunt.file.readJSON('sftp.json'),
		sftpOptions: {
			path: '/usr/share/nginx/html/letters/',
			host: '<%= secret.host %>',
			username: '<%= secret.username %>',
			password: '<%= secret.password %>',
			showProgress: true,
			srcBasePath: "../deploy/",
			createDirectories: true
		},
		sftp: {
			uploadFull: {
				files: { "./": "../deploy/**" },
				options: '<%= sftpOptions %>'
			},
			uploadNoAudio: {
				files: { "./": ["../deploy/**", "!../deploy/assets/audio/**"] },
				options: '<%= sftpOptions %>'
			},
			uploadLite: {
				files: { "./": ["../deploy/js/game.min.js", "../deploy/index.html"] },
				options: '<%= sftpOptions %>'
			}
		},

		compress: {
			main: {
				options: {
					archive: '../Drawing_Letters.zip',
					mode: "zip",
					level: 9
				},
				expand: true,
				cwd: "../deploy/",
				src: ['**']
			},

			kim: {
				options: {
					archive: '../Drawing_Letters_KIM.zip',
					mode: "zip",
					level: 9
				},
				expand: true,
				cwd: "../kim/",
				src: ['**']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-tinypng');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('fix-charset', ['copy:charset']);
	grunt.registerTask('deploy', ["fix-charset", "tinypng", 'clean:main', 'copy:main', 'copy:graphics', 'uglify', 'compress:main']);
	grunt.registerTask('kim', ['clean:kim', 'copy:kim', 'compress:kim']);
	grunt.registerTask('default', ['deploy', 'kim', 'sftp:uploadNoAudio']);
};