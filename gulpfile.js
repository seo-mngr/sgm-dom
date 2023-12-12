var gulp = require('gulp'),
    pkg = require('./package.json'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({browsers: ['last 2 versions']}),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache')
    svgSprite = require('gulp-svg-sprite'),
    svgMin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    fileinclude = require('gulp-file-include'),
    changed = require('gulp-changed'),
    browserSync = require('browser-sync').create();

var config = {
    distPath: 'dist',
    srcPath: 'src',
    themePath: 'wp-theme/'+pkg.name,
    wpClearThemePath: '/Users/eremenko/FREELANCE/!wp-clear-theme!'
};

var path = {
    src: {
        html: config.srcPath+'/*.html',
        css: config.srcPath+'/less/main.less',
        js: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/owl.carousel/dist/owl.carousel.min.js',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
            'node_modules/inputmask/dist/min/jquery.inputmask.bundle.min.js',
            'node_modules/jquery-validation/dist/jquery.validate.min.js',
            'node_modules/tooltipster/dist/js/tooltipster.bundle.min.js',
            'node_modules/jquery.animate-number/jquery.animateNumber.min.js',
            config.srcPath+'/js/svg-sprites.js',
            config.srcPath+'/js/sliders-galleries.js',
            config.srcPath+'/js/map.js',
            config.srcPath+'/js/modalForms.js',
            config.srcPath+'/js/sendMail.js',
            config.srcPath+'/js/youtube-video.js',
            config.srcPath+'/js/main.js'
        ],
        images: [config.srcPath+'/images/**/*', '!'+config.srcPath+'/images/icons{,/**}'],
        svgSprites: config.srcPath+'/images/icons/svg/**/*.svg',
        svgSpritesJs: config.srcPath+'/js/svg-sprites.js',
        favicon: config.srcPath+'/favicon.ico',
        jsonFiles: config.srcPath+'/**/*.json',
        includes: config.srcPath+'/includes/**/*.html',
        fonts: config.srcPath+'/fonts/**/*',
        themeCopyFiles: [config.distPath+'/**/*', '!'+config.distPath+'/*.html', '!'+config.distPath+'/includes/templates/*.html'],
        themeTemplates: config.srcPath+'/includes/templates/*.html',
        themeReplaceImageSrc: [config.themePath+'/**/*.html', config.themePath+'/**/*.php'],
        themeReplacePhpInclude: config.srcPath+'/*.html',
        themeCopyClearWpFiles: config.wpClearThemePath+'/**/*',
        themeReplaceStyleCssText: config.themePath+'/style.css'
    },
    watch: {
        html: config.srcPath+'/**/*.html',
        css: config.srcPath+'/less/**/*.less',
        js: config.srcPath+'/js/*.js',
        images: [config.srcPath+'/images/**/*', '!'+config.srcPath+'/images/icons{,/**}'],
        svgSprites: config.srcPath+'/images/icons/svg/**/*.svg',
        favicon: config.srcPath+'/favicon.ico',
        jsonFiles: config.srcPath+'/**/*.json',
        includes: config.srcPath+'/includes/**/*.html',
        fonts: config.srcPath+'/fonts/**/*'
    },
    dist: {
        html: config.distPath,
        css: config.distPath+'/css',
        js: config.distPath+'/js',
        images: config.distPath+'/images',
        svgSprites: config.distPath+'/images',
        svgSpritesJs: config.srcPath+'/js/',
        favicon: config.distPath,
        jsonFiles: config.distPath,
        includes: config.distPath+'/includes',
        fonts: config.distPath+'/fonts',
        themeTemplates: config.themePath+'/includes/templates/'
    }
};

gulp.task('serve', function() {
    browserSync.init({
        cors: true,
        server: {
            baseDir: config.distPath
        }
    });
});

//HTML
gulp.task('html', function () {
    return gulp.src(path.src.html)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//CSS
gulp.task('less', function () {
    return gulp.src(path.src.css)
    .pipe(less())
    .pipe(autoprefixer(['last 23 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//JS
gulp.task('js', function () {
    return gulp.src(path.src.js)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//FONTS
gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//IMAGES
gulp.task('images', function () {
    return gulp.src(path.src.images)
    .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
    })))
    .pipe(changed(path.dist.images))
    .pipe(gulp.dest(path.dist.images))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//SVG SPRITES JS
gulp.task('svg-sprites-js', function () {
    return gulp.src(path.src.svgSpritesJs)
    .pipe(replace(/var revision = (.*);/g, "var revision = "+new Date().getTime()+";"))
    .pipe(gulp.dest(path.dist.svgSpritesJs))
});

//SVG SPRITES
gulp.task("svg-sprites", gulp.series('svg-sprites-js', function () {
    return gulp.src(path.src.svgSprites)
    .pipe(svgMin({
        js2svg: {
          pretty: true
        }
     }))
     .pipe(cheerio({
         run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {
            xmlMode: true
        }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
        svg: {
            xmlDeclaration: false,
            doctypeDeclaration: false,
            dimensionAttributes: false,
            rootAttributes: {
                width: 0,
                height: 0,
                style: 'display:none'
            }
        },
        shape: {
            id: {
                generator: "icon-"
            }
        },
        mode: {
            symbol: {
                sprite: "../svg-sprites.svg"
            }
        }
    }))
    .pipe(gulp.dest(path.dist.svgSprites))
    .pipe(browserSync.reload({
        stream: true
    }));
}));

//FAVICON
gulp.task('favicon', function () {
    return gulp.src(path.src.favicon)
    .pipe(gulp.dest(path.dist.favicon))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//jsonFiles
gulp.task('jsonFiles', function () {
    return gulp.src(path.src.jsonFiles)
    .pipe(gulp.dest(path.dist.jsonFiles))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//INCLUDES
gulp.task('includes', function () {
    return gulp.src(path.src.includes)
    .pipe(changed(path.dist.includes))
    .pipe(gulp.dest(path.dist.includes))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//REMOVE "dist" FOLDER
gulp.task('clean-build', function() {
    return del(config.distPath, {force: true});
});

//REMOVE "theme" FOLDER
gulp.task('clean-theme', function() {
    return del(config.themePath, {force: true});
});

//WATCH
gulp.task('watch', function() {
    gulp.watch(path.watch.css, gulp.parallel('less'));
    gulp.watch(path.watch.html, gulp.parallel('html'));
    gulp.watch(path.watch.js, gulp.parallel('js'));
    gulp.watch(path.watch.fonts, gulp.parallel('fonts'));
    gulp.watch(path.watch.images, gulp.parallel('images'));
    gulp.watch(path.watch.svgSprites, gulp.parallel('svg-sprites'));
    gulp.watch(path.watch.favicon, gulp.parallel('favicon'));
    gulp.watch(path.watch.jsonFiles, gulp.parallel('jsonFiles'));
    gulp.watch(path.watch.includes, gulp.parallel('includes'));
});

//theme: copy all folders | files without html
gulp.task('theme:copyAllFolders', function () {
    return gulp.src(path.src.themeCopyFiles)
    .pipe(gulp.dest(config.themePath))
});

//theme: rename all *.html templates to *.php
gulp.task('theme:renameHtmlToPhp', function () {
    return gulp.src(path.src.themeTemplates)
    .pipe(gulp.dest(function(file) {
        file.basename = file.basename.split( '.' )[0] + '.php';
        return path.dist.themeTemplates;
    }))
});

//theme: replace images src
gulp.task('theme:replaceImageSrc', function () {
    return gulp.src(path.src.themeReplaceImageSrc)
    .pipe(replace('images/', '<?php bloginfo("template_directory"); ?>/images/'))
    .pipe(gulp.dest(config.themePath))
});

//theme: copy & replace html files
gulp.task('theme:replacePhpInclude', function () {
    return gulp.src(path.src.themeReplacePhpInclude)
    .pipe(replace(/\@\@include\(\'(.*).html\'\)/g, "<? include(locate_template('$1.php')); ?>"))
    .pipe(replace(/\@\@include\(\'(.*).html\'\,\ {[^=]*\}\)/g, "<? include(locate_template('$1.php')); ?>"))
    .pipe(rename({extname: ".tmp.php"}))
    .pipe(gulp.dest(config.themePath))
});

//theme: copy wp-clear-theme files and folders
gulp.task('theme:copyClearWpFiles', function () {
    return gulp.src(path.src.themeCopyClearWpFiles)
    .pipe(gulp.dest(config.themePath))
});

//theme: replace text in style.css on theme folder
gulp.task('theme:replaceStyleCssText', function () {
    return gulp.src(path.src.themeReplaceStyleCssText)
    .pipe(replace('{themeName}', pkg.name))
    .pipe(replace('{year}', new Date().getFullYear()))
    .pipe(replace('{version}', pkg.version))
    .pipe(replace('{author}', pkg.author))
    .pipe(gulp.dest(config.themePath))
});

//BUILD DIST
gulp.task("build", gulp.series('clean-build', gulp.parallel(
    'html',
    'less',
    'js',
    'fonts',
    'images',
    'svg-sprites',
    'favicon',
    'jsonFiles',
    'includes'
)));

//BUILD WP THEME
gulp.task("build-theme", gulp.series('clean-theme',
    gulp.parallel('theme:copyAllFolders'),
    gulp.parallel('theme:renameHtmlToPhp'),
    gulp.parallel('theme:replaceImageSrc'),
    gulp.parallel('theme:replacePhpInclude'),
    gulp.parallel('theme:copyClearWpFiles'),
    gulp.parallel('theme:replaceStyleCssText')
));

//DEFAULT
gulp.task('default', gulp.series(
    gulp.parallel('build'),
    gulp.parallel('watch', 'serve')
));
