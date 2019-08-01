const fs = require('fs')
const getJuejin = require('./getJuejin.js')
const getSf = require('./getSf.js')
const async = require('async')

let data = []

function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  return Array.from(new Set(arr))
}

async.series([
    // 获取信息
    function (done) {
      getJuejin.data(function(err, list) {
        data = data.concat(list)
        done(err)
      })
    },
    function (done) {
      getSf.data(function(err, list) {
        data = data.concat(list)
        done(err)
      })
    },
    // 过滤信息并生成markdown
    function (done) {
      const list = unique(data)
      let newData = []
      list.forEach(item => {
        newData.push(
          '\n#### ' + item.title + '\n' +
          '##### ' + item.summaryInfo + '\n' +
          '[to link]("' + item.originalUrl + '")\n'
        )
      })
      const time = new Date().getTime()
      const fileName = `./data-${time}.md`
      fs.writeFile(fileName, newData, function(err){
        console.log(fileName + '--- 写入成功');
        done(err)
      })
    },

], function(err) {
    if (err) {
      console.log(err)
    }
    console.log('完成')
    process.exit(0)
})