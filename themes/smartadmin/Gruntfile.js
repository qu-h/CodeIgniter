module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    // Load the Grunt plugins.
    require('matchdep')
        .filterDev('grunt-*')
        .forEach(grunt.loadNpmTasks);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Project configuration.
    // grunt.initConfig({
    //     pkg: grunt.file.readJSON('package.json'), cssmin: {
    //         sitecss: {
    //             options: {
    //                 banner: '/* LicenseMgr Minified css file */'
    //             }, files: {
    //                 '/var/www/quanict.github.io/themes/SmartAdmin/smartadmin.min.css': [
    //                     'css/bootstrap.min.css',
    //                     'css/font-awesome.min.css',
    //                     'css/smartadmin-production-plugins.min.css',
    //                     'css/smartadmin-production.css'
    //                 ]
    //             }
    //         }
    //     }, uglify: {
    //         options: {
    //             report: 'min',
    //             compress: true,
    //             mangle: true
    //         },
    //         // 'ng-app-min': {
    //         //     files: {
    //         //         'client/public/js/ng/site.min.js': [
    //         //             'client/scripts/home/site.js',
    //         //             'client/scripts/home/one.js'
    //         //         ],
    //         //         'client/public/js/ng/licensemgr.min.js': [
    //         //             'client/scripts/models/routingConfig.js',
    //         //             'client/scripts/licensemgr/one.js'
    //         //         ]
    //         //     }
    //         // }
    //     }, ngAnnotate: {
    //         options: {
    //             singleQuotes: true
    //         },
    //         // app1: {
    //         //     files: {
    //         //         'client/scripts/home/one.js': [
    //         //             'client/scripts/home/app.js',
    //         //             'client/scripts/home/services.js',
    //         //             'client/scripts/home/controllers.js',
    //         //             'client/scripts/home/filters.js',
    //         //             'client/scripts/home/directives.js'
    //         //         ]
    //         //     }
    //         // }
    //     }
    // });
    //
    // // Register the default tasks.
    // grunt.registerTask('default', ['ngAnnotate', 'uglify', 'cssmin']);
    grunt.initConfig({

        gitIOPath: "/var/www/quanict.github.io/themes/SmartAdmin",
        sass: {
            options: {
                compass: false, noCache: true, style: 'compressed', sourcemap: 'none'
            },
            build: {
                files : {
                    "css/customize.css" : "scss/customize.scss"
                }
            }
            // dist: {
            //     files: [{
            //         expand: true,
            //         cwd: 'scss',
            //         src: ['*.scss'],
            //         dest: '../css',
            //         ext: '.css'
            //     }]
            // }
        },
        cssc: {
            build: {
                options: {
                    debugInfo: false,
                    sortSelectors: true,
                    lineBreaks: true,
                    sortDeclarations:true,
                    consolidateViaDeclarations:true,
                    consolidateViaSelectors:false,
                    consolidateMediaQueries:true
                },
                files: {
                '<%=gitIOPath%>/css/smartadmin.css': [
                    'css/bootstrap.min.css',
                    'css/font-awesome.min.css'
                ]}
            }
        },
        cssmin: {
            options: {
                mode: 'gzip',
                report: 'min'
            },
            minify: {
                files: {
                    '<%=gitIOPath%>/css/smartadmin.min.css':
                        [
                            'css/bootstrap.min.css',
                            'css/font-awesome.min.css',
                            'css/smartadmin-production-plugins.min.css',
                            'css/smartadmin-production.css',
                            'css/smartadmin-skins.min.css',
                            "css/smartadmin-rtl.min.css",
                            "css/demo.min.css",
                            "css/customize.css"
                        ]
                }
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false
            },
            build: {
                files: {
                    '/var/www/quanict.github.io/themes/SmartAdmin/css/smartadmin.min.css': [
                        'css/bootstrap.min.css',
                        'css/font-awesome.min.css'
                    ]
                    //'dist/main.min.css': ['dist/main.css']
                }
            }
        }


    });


    //grunt.registerTask('buildcss',  [ 'cssc']);
    grunt.registerTask('buildcss', ['sass','cssmin']);
};