'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const { resolve } = require('path');
const remote = require('yeoman-remote');
const yoHelper = require('@feizheng/yeoman-generator-helper');
const replace = require('replace-in-file');

require('@afeiship/next-npm-registries');

const NPM_CHOICES = ['npm', 'github', 'alo7'].map(item => {
  return { name: item, value: nx.npmRegistries(item) };
});

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red(
          'boilerplate-node-package'
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "scope",
        message: "Your scope (eg: `babel` )?",
        default: 'feizheng'
      },
      {
        type: 'list',
        name: 'registry',
        message: 'Your registry',
        choices: NPM_CHOICES
      },
      {
        type: 'input',
        name: 'project_name',
        message: 'Your project_name (eg: like this `nice-try` )?',
        default: yoHelper.discoverRoot
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your description?'
      }
    ];

    return this.prompt(prompts).then(
      (props) => {
        // To access props later use this.props.someAnswer;
        this.props = props;
        yoHelper.rewriteProps(props);
      }
    );
  }

  writing() {
    const done = this.async();
    remote(
      'afeiship',
      'boilerplate-node-package',
      (err, cachePath) => {
        // copy files:
        this.fs.copyTpl(
          glob.sync(resolve(cachePath, '{**,.*}')),
          this.destinationPath(),
          this.props
        );
        done();
      }
    );
  }

  end() {
    const { project_name, description, projectName } = this.props;
    const files = glob.sync(
      resolve(this.destinationPath(), '{**,.*}')
    );

    replace.sync({
      files,
      from: [
        /boilerplate-node-package-description/g,
        /boilerplate-node-package/g,
        /boilerplateNodePackage/g
      ],
      to: [description, project_name, projectName]
    });
  }
};
