import gulp, { series } from "gulp";
import * as del from "del";
import log from "fancy-log";
import mjml from "gulp-mjml";
import mjmlEngine from "mjml";

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
		.pipe(mjml(mjmlEngine, { minify: false }))
		.pipe(gulp.dest(`./${outputFolder}`));

	// build mjml

	// inline css

	// minify file

	// wcag check

	done();
});

gulp.task("default", series("clean", "build"));
