'use strict'

module.exports = function promiseWaterfall (promiseChain, initialData) {
  return promiseChain.reduce(function (accumulator, resolvingCallback) {
    return accumulator.then(resolvingCallback)
  }, Promise.resolve(initialData))
}
