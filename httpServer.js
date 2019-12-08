const puppeteer = require('puppeteer');
const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
console.log('server starting');

// const url = 'https://dou.ua/lenta/';
// const selector = '.b-lenta';
(async function getData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage(); 
    
    io.on('connection', await function (socket) {
      socket.on('new-msg',function(data){        
        socket.emit('msg', {url: data.url, selector: data.selector})
      });
       setTimeout(()=>{
      socket.on('article', async function(data){ 
        await  page.goto(data.url);
        const art = await page.$eval(data.selector, el => el.innerHTML);
        console.log(art)
        socket.emit('news', art)
      });
      },3000) 
      
    }); 
})();


