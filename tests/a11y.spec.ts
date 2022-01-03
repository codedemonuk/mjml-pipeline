import { expect } from "chai";
import * as glob from "glob";
import * as aChecker from "accessibility-checker";
import { ICheckerReport } from "accessibility-checker/lib/api/IChecker";
import * as fs from "fs";

const a11yCheckTimeout = 10_000; // A11y checks can be slow to process

describe("Accessibility checks", async () => {
	const files = glob.sync("./dist/fat/**/*.html");

	files.forEach((htmlFile) => {
		it(`${htmlFile} template should have 0 WCAG violations`, async () => {
			var content = await fs.promises.readFile(htmlFile, "utf8");

			return aChecker.getCompliance(content, htmlFile).then((results) => {
				const report = results.report as ICheckerReport;
				expect(report.summary.counts.violation).to.be.equal(0, aChecker.stringifyResults(report));
			});
		}).timeout(a11yCheckTimeout);
	});
});
