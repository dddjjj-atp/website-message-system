var http = require('http');
var fs= require('fs');
//所以引入url模块
var urlObj = require('url');
var template = require('art-template');

var comments=[


];
var server = http.createServer();
server.on('request',function (req, res){
   // 使用 url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
    var parseObj = urlObj.parse(req.url, true)

   var pathname = req.url;
   
  //如果 请求/返回的是/index.html

  if (pathname === '/') {
    fs.readFile('./views/index.html', function (err, data) {
      if(err){
        return res.end('404 can not find');
       
      }

     var htmlStr = template.render(data.toString(), {
          comments: comments
        })
        res.end(htmlStr)
  }) 
  }else if(pathname.indexOf('/public/')===0) { //如果请求的是public下的资源，就当做public中的资源，然后就可以将请求资源当做文件资源来处理
        fs.readFile('.'+pathname, function(err, data){
          if(err){
            return res.end('file can not found');
          }

          res.end(data);
        })

    } else if (pathname === '/post') {
        fs.readFile('./views/post.html', function (err, data) {
          if(err){
            return res.end('post can not found');
          }

          res.end(data);
        });
    }else if (pathname.indexOf('/pinglun')===0 ){//说明点击了发表
      //将数据保存下来，这里为get提交，数据就在url地址中,获取到了对象中的内容
      var data = parseObj.query;
      //这里的发表日期先固定写死
   //   data.dateTime = '2017-11-2 17:11:22';
       data.dateTime = '2017-11-2 17:11:22';
      //将得到的数据存入comments 中
      comments.unshift(data)


      //接下来要做的是重定向
      res.statusCode = 302
      res.setHeader('Location', '/')
      res.end()



    }else {
      // 其它的都处理成 404 找不到
      fs.readFile('./views/404.html', function (err, data) {
        if (err) {
          return res.end('404 Not Found.')
        }
        res.end(data)
      })
    }

});

server.listen(3000,function (){
  
  console.log('server is running');

})