import gulp, {series} from "gulp";
import * as del from "del";
import log from "fancy-log";
import mjml from "gulp-mjml";
import mjmlEngine from "mjml";
import juice from "premailer-gulp-juice";
import htmlmin from "gulp-htmlmin";
import mocha from "gulp-mocha";
import through2 from "through2";
import fmMarkdown from "front-matter-markdown";
import * as fs from "fs";
import { resolve } from "path";
const vinyl = require("vinyl");
const commonmark = require("commonmark");

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

	gulp.src(`${sourceFolder}/markdown/**/**.md`)
	.pipe(through2.obj(function(file, opts, cb){
		const settings = fmMarkdown(file._contents.toString()) as { template: string, baseTemplate: string, subject: string, preview: string, content: string}
		const markdown = settings.content;

		const mjmlTemplate = fs.readFileSync(`src/mjml/${settings.baseTemplate}.mjml`).toString();
		const mdParser = new commonmark.Parser();
		const mdWriter = new commonmark.HtmlRenderer();
		const messageContent = mdWriter.render(mdParser.parse(markdown));

		const renderedTemplate = mjmlTemplate
			.replace("#{content}", messageContent)
			.replace("#{subject}", settings.subject)
			.replace("#{preview}", settings.preview);

		const outFile = new vinyl({
			cwd: "/",
			base: "/output",
			path: `/output/${settings.template}.mjml`,
			contents: Buffer.from(renderedTemplate)
		});

		cb(null, outFile);
	}))
	.pipe(gulp.dest(`./${outputFolder}/mjml`))
	.pipe(through2.obj(function(file, opts, cb){
		const results = mjmlEngine(file._contents.toString())
		const outFile = new vinyl({
			cwd: "/",
			base: "/output",
			path: `/output/${file.stem}.html`,
			contents: Buffer.from(results.html)
		});

		cb(null, outFile);
	}))
	// // inline css
	.pipe(juice())
	.pipe(gulp.dest(`./${outputFolder}/full-fat`))
	// minify file
	.pipe(htmlmin(htmlMinOptions))
	.pipe(gulp.dest(`${outputFolder}/diet`));

	done();
});

gulp.task("a11y-checks", (done) => {
	return gulp.src("tests/**/*.spec.ts", { read: false }).pipe(mocha({}));
});

gulp.task("build-only", series("clean", "build"))
gulp.task("default", series("build-only", "a11y-checks"));
