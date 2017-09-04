const crypto = require('crypto')

/**
 * convert string to base64 string
 *
 * @param {String} str - string
 *
 * @returns {String} - base64 string
 */
function base64 (str) {
  return Buffer.from(str).toString('base64')
}

/**
 * HMAC_SHA1
 *
 * @param {string} str - string
 * @param {(string|buffer)} key - secret key
 * @param {boolean} isBuffer - get buffer, default false
 *
 * @returns {string} - h mac sha1 string
 */
function hMacSha1 (str, key, isBuffer) {
  let buffer = crypto.createHmac('sha1', key).update(str)
  return isBuffer ? buffer : buffer.digest('hex')
}

/**
 * MD5
 *
 * @param {string} str - string
 * @param {boolean} isBuffer - get buffer, default false
 *
 * @returns {string} - md5 string
 */
function md5 (str, isBuffer = false) {
  let buffer = crypto.createHash('md5').update(str)
  return isBuffer ? buffer : buffer.digest('hex')
}

/**
 * SHA1
 *
 * @param {string} str - string
 * @param {boolean} isBuffer - get buffer, default false
 *
 * @returns {string} - sha1 string
 */
function sha1 (str, isBuffer = false) {
  let buffer = crypto.createHash('sha1').update(str)
  return isBuffer ? buffer : buffer.digest('hex')
}

/**
 * SHA256
 *
 * @param {string} str - string
 * @param {boolean} isBuffer - get buffer, default false
 *
 * @returns {string} - sha256 string
 */
function sha256 (str, isBuffer = false) {
  let buffer = crypto.createHash('sha256').update(str)
  return isBuffer ? buffer : buffer.digest('hex')
}

module.exports = {
  base64,
  hMacSha1,
  md5,
  sha1,
  sha256
}
