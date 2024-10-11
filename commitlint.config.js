// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: 'conventional-changelog-atom',
    formatter: '@commitlint/format',
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat', // New feature
          'fix', // Bug fix
          'docs', // Documentation changes
          'style', // Formatting (no functional changes)
          'refactor', // Code changes without adding features or fixing bugs
          'perf', // Performance improvement
          'test', // Tests
          'build', // Changes to the build process
          'ci', // Changes to CI configuration
          'chore', // Maintenance tasks
          'revert', // Reverting commits
        ],
      ],
      'scope-enum': [
        2,
        'always',
        [
          'setup', // Project setup
          'config', // Configuration files
          'deps', // Dependencies
          'feature', // Feature-specific changes
          'bug', // Bug fixes
          'docs', // Documentation
          'style', // Code styling
          'refactor', // Code refactoring
          'test', // Tests
          'build', // Build scripts or configuration
          'ci', // CI-related changes
          'release', // Release related changes
          'other', // Other changes
        ],
      ],
    },
  };
  