var request = require('request')
var iconv = require('iconv-lite')

function getProxyList () {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      url: 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%25B5%25E7%25D0%25C5%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1',
      gzip: true,
      encoding: null,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        'referer': 'http://www.66ip.cn/'
      }
    }
    request(options, function (error, response, body) {
      try {
        if (error) throw error

        body = (/meta.*charset=gb2312/.test(body)) ? iconv.decode(body, 'gbk') : body

        resolve(body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g))
      } catch (e) {
        return reject(e)
      }
    })
  })
}

getProxyList()
.then(function (proxyList) {
  var targetOptions = {
    method: 'GET',
    url: 'http://ip.chinaz.com/getip.aspx',
    timeout: 5000,
    encoding: null
  }
  proxyList.forEach(proxyurl => {
    console.log(`testing ${proxyurl}`)

    targetOptions.proxy = `http://${proxyurl}`
    request(targetOptions, function (error, response, body) {
      try {
        if (error) throw error

        body = body.toString()
        console.log(`代理${proxyurl} 验证成功 ==>> ${body}`)
      } catch (e) {
        // console.error(e)
      }
    })
  })
}).catch(e => {
  // console.log(e)
})
