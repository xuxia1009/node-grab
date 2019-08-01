const request = require('request')
const querystring = require('querystring')
const fs = require('fs')

function getTopics(Token, callback) {  
    const { token, clientId, userId } = Token
    const qs = querystring.stringify({
        src: 'web',
        uid: userId,
        client_id: clientId,
        token: token,
        pageNum: 1
    })
    request.get({
        url: `https://xiaoce-timeline-api-ms.juejin.im/v1/getListByLastTime?${qs}`
    }, function (err, res, body) { 
        if(err){
            return callback(err)
        }
        body = JSON.parse(body)
        if (body.s !== 1) {     //出错时清空信息
            fs.writeFileSync('./user.json', JSON.stringify({}));
            return { type: 'token', message: body.m };
        } else {
            let list = body.d
            list = list.map((item) => {
              return {
                originalUrl: `https://juejin.im/post/${item.id}`,
                title: item.title,
                summaryInfo: item.desc
                }
            })
            callback(null, list)
        }
    });
    
}

exports.data = function(callback){
    request({
        url: 'https://juejin.im/auth/type/phoneNumber',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: "xuxia310928", phoneNumber: "18810986017"}) //账号密码
    }, function(err, res, body) {
        if(err){
            return callback(err)
        }
        const cookie = res.headers['set-cookie'];
        const encodeToken = cookie[0]
            .split(';')[0]
            .split('=')[1];
        const decodeToken = JSON.parse(new Buffer(encodeToken, 'base64').toString())
        
        getTopics(decodeToken, callback)
    });    
}