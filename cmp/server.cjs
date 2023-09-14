const connect = require('connect'),
      gzipStatic = require('connect-gzip-static'),
      serveStatic = require('serve-static'),
      {createProxyMiddleware} = require('http-proxy-middleware'),
      argv = require('yargs').argv,
      path = require('path'),
      fs = require('fs'),
      https = require('https'),
      cors = require('cors'),
      connectExtensions = require('nodejs-connect-extensions');

require('dotenv').config();

const app = connect();

connectExtensions.extendConnectUse(app);

const wwwroot = path.join(__dirname, 'wwwroot');

const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.crt');

const options = 
{
    key: key,
    cert: cert
};

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    app.use(cors());

    //WEBPACK 5 DEV SERVER
    app.use(createProxyMiddleware(['/dist'],
    {
        target: 'http://localhost:9002',
        ws: true,
    }));
}

//return static files
app.use(gzipStatic(wwwroot, 
                   {
                       ...!!argv.webpack ? {} :
                       {
                           maxAge: '7d',
                           setHeaders: function setCustomCacheControl (res, path) 
                           {
                               if (serveStatic.mime.lookup(path) === 'text/html') 
                               {
                                   // Custom Cache-Control for HTML files
                                   res.setHeader('Cache-Control', 'public, max-age=0');
                               }
                           }
                       }
                   }));

console.log("Listening on port 8081 => http://localhost:8081");
//create node.js http server and listen on port
app.listen(8081);
console.log("Listening on port 4444 => https://localhost:4444");
//create node.js https server and listen on port
https.createServer(options, app).listen(4444);