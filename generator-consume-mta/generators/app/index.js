var Generator = require('yeoman-generator');
var chalkPipe = require('chalk-pipe');
var Inquirer = require('inquirer');
var path = require('path');
var Env = require('yeoman-environment');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.getPrompts = function() {
      console.log('in getPrompts()');
      return [{name:"Prompt 1"},{name: "Prompt 2"},{name: "Registration"}];
    }

    this.composeWith(require.resolve('/Users/i034929/repos/generator-base-mta/generators/app'));
    this.mtaGen = this._composedWith[0];
    this.option('babel');
  }

  destinationRoot(root) {
    if (root && this.mtaGen) {
      this.mtaGen.destinationRoot(root);
    }
    return super.destinationRoot(root);
  }

  paths() {
    this.log(this.destinationRoot());
    // returns '~/projects'

    this.log(this.destinationPath('index.js'));
    // returns '~/projects/index.js'
  }

  async prompting() {
    let prompts = this.mtaGen.getQuestions();
    prompts.push(...[
      {
        type: "confirm",
        name: "hungry",
        message: "Are you hungry?",
        store: true
      }
    ]);

    this.answers = await this.prompt(prompts);
    this.mtaGen.setAnswers(this.answers);
  }

  default() {
    const mtaRoot = this.mtaGen.getMtaRoot();
    this.log(`mtaConfig: ${mtaRoot}`);
  }

  async writing() {
    this.log('in writing');
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      {
        title: 'Templating with Yeoman',
        hungry: this.answers.hungry
      }
    );
  }

  end() {
    this.log('in end');
  }
};
