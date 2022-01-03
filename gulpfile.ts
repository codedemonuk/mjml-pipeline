import gulp, { series } from "gulp";
import * as del from "del";
import log from "fancy-log";
import mjml from "gulp-mjml";
import mjmlEngine from "mjml";
import juice from "premailer-gulp-juice";
import htmlmin from "gulp-htmlmin";

const outputFolder = "dist";
const sourceFolder = "src";

gulp.task("clean", (done) => {
	log.info(`Cleaning folder ${outputFolder}`);
	del.sync([`${outputFolder}/**/*`]);
	done();
});

gulp.task("build", (done) => {
	gulp
		.src(`${sourceFolder}/**/*.mjml`)
		// build mjml
		.pipe(mjml(mjmlEngine, { minify: false }))
		// inline css
		.pipe(juice())
		// minify file
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(`./${outputFolder}`));

	//TODO:
	// wcag check

	done();
});

gulp.task("default", series("clean", "build"));
