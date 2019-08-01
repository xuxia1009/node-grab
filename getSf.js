const request = require('request')
const cheerio = require('cheerio')
const baseUrl = 'https://segmentfault.com'
// 删除字符串左右两端的空格
function trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function getSf(callback){
  request('https://segmentfault.com/channel/frontend', function(err, response, body){
    if(err){
      return callback(err)
    }
    if( !err && response.statusCode == 200 ){
      // body为源码
      // 使用 cheerio.load 将字符串转换为 cheerio(jQuery) 对象，
      // 按照jQuery方式操作即可
      var $ = cheerio.load(body);
      
      // 输出导航的html代码
      var data = [];
      $('.news-list .news-item').each(function(){
        var $this = $(this);

        // 使用trim去掉数据两端的空格
        data.push({
          originalUrl: baseUrl + trim($this.find('.news__item-info a').attr('href')),
          title: $this.find('.news__item-title').text(),
          summaryInfo: trim($this.find('.article-excerpt').text())
        })
      });
      callback(null, data)
    }
  })
}

exports.data = function(callback){
  getSf(callback)
}