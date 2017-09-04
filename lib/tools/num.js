/**
 * range numbder
 *
 * @param {number} num - value number
 * @param {number} min - min value
 * @param {number} max - max value
 *
 * @returns {number} - value
 */
function range (num, min, max) {
  return Math.min(Math.max(num, min), max)
}

/** number tools */
module.exports = {
  range
}
