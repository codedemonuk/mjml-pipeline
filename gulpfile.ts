import gulp, { series } from "gulp";
import * as del from "del";
import log from "fancy-log";
import mjml from "gulp-mjml";
import mjmlEngine from "mjml";
import juice from "premailer-gulp-juice";

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
		.pipe(gulp.dest(`./${outputFolder}`));

	//TODO:
	// minify file
	// wcag check

	done();
});

gulp.task("default", series("clean", "build"));
