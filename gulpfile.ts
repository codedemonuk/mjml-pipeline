import gulp, { series } from "gulp";
import * as del from "del";
import log from "fancy-log";
import mjml from "gulp-mjml";
import mjmlEngine from "mjml";
import juice from "premailer-gulp-juice";
import htmlmin from "gulp-htmlmin";
import mocha from "gulp-mocha";

const outputFolder = "dist";
const sourceFolder = "src";

gulp.task("clean", (done) => {
	log.info(`Cleaning folder ${outputFolder}`);
	del.sync([`${outputFolder}/**/*`]);
	done();
});

gulp.task("build", (done) => {
	// See https://github.com/kangax/html-minifier#options-quick-reference
	const htmlMinOptions = {
		collapseWhitespace: true,
		conservativeCollapse: true,
		minifyCSS: true,
		keepClosingSlash: true,
	};

	gulp
		.src(`${sourceFolder}/**/*.mjml`)
		// build mjml
		.pipe(mjml(mjmlEngine, { minify: false }))
		// inline css
		.pipe(juice())
		.pipe(gulp.dest(`./${outputFolder}/fat`))
		// minify file
		.pipe(htmlmin(htmlMinOptions))
		.pipe(gulp.dest(`./${outputFolder}/diet`));

	done();
});

gulp.task("a11y-checks", (done) => {
	return gulp.src("tests/**/*.spec.ts", { read: false }).pipe(mocha({}));
});

gulp.task("default", series("clean", "build", "a11y-checks"));
