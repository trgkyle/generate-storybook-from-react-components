const { promisify } = require('util');
const { join } = require('path');
const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);
const Path = require("path");
const FS   = require("fs");
const Files  = [];

function ThroughDirectory(Directory) {
    FS.readdirSync(Directory).forEach(File => {
        const Absolute = Path.join(Directory, File);
        if (FS.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return Files.push(Absolute);
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
	console.log(Files);
	const pathRelative = config.path;
	if (config.path.substr(0, 2) !== '..') {
		config.path = `..${config.path}`;
	}

	await Promise.all(Files.map(async(dir)=> {
		const a = dir.split(pathRelative)[1].split('/');
		a.splice(-1);
		const path = config.path +  a.join('/');
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