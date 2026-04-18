const { getDefaultConfig } = require('expo/metro-config');

// Add polyfill for toReversed if it doesn't exist (Node.js < 20)
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    return this.slice().reverse();
  };
}

const config = getDefaultConfig(__dirname);

module.exports = config;
