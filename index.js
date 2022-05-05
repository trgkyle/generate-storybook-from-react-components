const { promisify } = require('util');
const { join } = require('path');
const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);
const path = require("path");
const fs = require("fs");
const files = [];

function ThroughDirectory(Directory) {
	fs.readdirSync(Directory).forEach(File => {
		const absolute = path.join(Directory, File);
		if (fs.statSync(absolute).isDirectory()) return ThroughDirectory(absolute);
		else return files.push(absolute);
	});
}
async function runner(config, rootPath) {
	let content = `import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ___tpl_name___ from '___component_path______tpl_name___';
import '___component_path______tpl_name___/___tpl_name___.scss';

storiesOf('___tpl_name___', module)
	.add('insert different states here', () => {
		return <___tpl_name___ />;
	});`;
	const dirnames = __dirname + config.path;
	console.log("Scan all files components in ", dirnames);
	ThroughDirectory(dirnames);
	console.log(files);
	const subPathRelative = config.path;
	if (config.path.substr(0, 2) !== '..') {
		config.path = `..${config.path}`;
	}

	await Promise.all(files.map(async (dir) => {
		const relativePath = dir.split(subPathRelative)[1].split('/');
		relativePath.splice(-1);
		const path = config.path + relativePath.join('/');
		const pathNameSplit = dir.split('/');
		const name = pathNameSplit[pathNameSplit.length - 1].split('.js')[0];
		content = content.replace(/___component_path___/g, path);
		content = content.replace(/___tpl_name___/g, name);

		try {
			await writeFile(
				join(rootPath, 'stories', `${name}.stories.js`),
				content
			);
			return true;
		} catch (error) {
			return false;
		}
	}));
}

runner({ path: '/components/' }, __dirname);