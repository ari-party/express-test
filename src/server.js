#!/usr/bin/env node

import express from "express";
import kleur from "kleur";
import process from "node:process";
import { URL } from "node:url";
import { Command } from "commander";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { name, description, version } = require("../package.json");

const program = new Command();
program
	.name(name)
	.description(description)
	.version(version)
	.option("-p, --port", "port", 80)
	.option("-h, --headers", "include headers in logs", false)
	.option("-q, --query", "include url query in logs", false);
program.parse(process.argv);
const options = program.opts();

const app = express();
app.all("*", (request, response) => {
	const url = new URL(
		`${request.protocol}://${request.hostname}${request.originalUrl}`,
	);
	console.log(
		kleur.bold(request.method),
		kleur.gray('"') +
			request.path +
			(options.query ? url.search : "") +
			kleur.gray('"'),
		options.headers ? { ...request.headers } : "",
	);
	response.end();
});
app.listen(options.port, () => {
	console.log(kleur.blue().bold("!"), "listening on port", options.port);
});
