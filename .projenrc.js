const { AwsCdkTypeScriptApp, DependenciesUpgradeMechanism } = require('projen');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.82.0',
  name: 'eks-cicd-codebuild',
  cdkDependencies: [
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-ecr',
    '@aws-cdk/aws-eks',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-codebuild',
    '@aws-cdk/aws-codecommit',
    '@aws-cdk/aws-events-targets',
  ],
  minNodeVersion: '14.17.0',
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
  defaultReleaseBranch: 'main',
});

project.package.addField('resolutions', {
  'pac-resolver': '5.0.0',
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'dockerAssets.d', 'yarn-error.log'];
project.npmignore.exclude('images', ...common_exclude);
project.gitignore.exclude(...common_exclude);


project.synth();
