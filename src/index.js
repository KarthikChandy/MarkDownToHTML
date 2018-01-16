exports.handler = (event, context, callback) => {

    const AWS = require('aws-sdk');
    const marked = require('marked');
    
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
      });

    AWS.config.update({
        region: 'ap-southeast-2' // Change the region to the appropriate one.
    });

    var s3 = new AWS.S3();


    event.Records.forEach((r) => {

        var bucketname = r.s3.bucket.name;
        var key = r.s3.object.key;

        let s3getObject = s3.getObject({
            Bucket: bucketname,
            Key: key
        }).promise();

        s3getObject.then((data) => {

          return marked(String(data.Body));

        }).then((formatted) => {

            let newFileName = key.split(".")[0] + ".html"
            console.log(`Uploading file ${newFileName} to the bucket mnhtmloutput`);


            // Generate the HTML Header, Style & Body

            var head = `<html>
                   <head>
                   <meta charset="utf-8">
                   <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                   <title>Markdown</title>
                   <style>
                   @font-face {
                    font-family: octicons-anchor;
                    src: url(data:font/woff;charset=utf-8;base64,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) format('woff');
                  }
                  
                  body {
                    background-color: white;
                    max-width: 790px;
                    margin: 0 auto;
                    padding: 30px 0;
                  }
                  
                  .markdown-body {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    color: #333;
                    overflow: hidden;
                    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    word-wrap: break-word;
                  }
                  
                  .markdown-body a {
                    background: transparent;
                  }
                  
                  .markdown-body a:active,
                  .markdown-body a:hover {
                    outline: 0;
                  }
                  
                  .markdown-body strong {
                    font-weight: bold;
                  }
                  
                  .markdown-body h1 {
                    font-size: 2em;
                    margin: 0.67em 0;
                  }
                  
                  .markdown-body img {
                    border: 0;
                  }
                  
                  .markdown-body hr {
                    -moz-box-sizing: content-box;
                    box-sizing: content-box;
                    height: 0;
                  }
                  
                  .markdown-body pre {
                    overflow: auto;
                  }
                  
                  .markdown-body code,
                  .markdown-body kbd,
                  .markdown-body pre {
                    font-family: monospace, monospace;
                    font-size: 1em;
                  }
                  
                  .markdown-body input {
                    color: inherit;
                    font: inherit;
                    margin: 0;
                  }
                  
                  .markdown-body html input[disabled] {
                    cursor: default;
                  }
                  
                  .markdown-body input {
                    line-height: normal;
                  }
                  
                  .markdown-body input[type="checkbox"] {
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    padding: 0;
                  }
                  
                  .markdown-body table {
                    border-collapse: collapse;
                    border-spacing: 0;
                  }
                  
                  .markdown-body td,
                  .markdown-body th {
                    padding: 0;
                  }
                  
                  .markdown-body * {
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                  }
                  
                  .markdown-body input {
                    font: 13px/1.4 Helvetica, arial, freesans, clean, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
                  }
                  
                  .markdown-body a {
                    color: #4183c4;
                    text-decoration: none;
                  }
                  
                  .markdown-body a:hover,
                  .markdown-body a:focus,
                  .markdown-body a:active {
                    text-decoration: underline;
                  }
                  
                  .markdown-body hr {
                    height: 0;
                    margin: 15px 0;
                    overflow: hidden;
                    background: transparent;
                    border: 0;
                    border-bottom: 1px solid #ddd;
                  }
                  
                  .markdown-body hr:before {
                    display: table;
                    content: "";
                  }
                  
                  .markdown-body hr:after {
                    display: table;
                    clear: both;
                    content: "";
                  }
                  
                  .markdown-body h1,
                  .markdown-body h2,
                  .markdown-body h3,
                  .markdown-body h4,
                  .markdown-body h5,
                  .markdown-body h6 {
                    margin-top: 15px;
                    margin-bottom: 15px;
                    line-height: 1.1;
                  }
                  
                  .markdown-body h1 {
                    font-size: 30px;
                  }
                  
                  .markdown-body h2 {
                    font-size: 21px;
                  }
                  
                  .markdown-body h3 {
                    font-size: 16px;
                  }
                  
                  .markdown-body h4 {
                    font-size: 14px;
                  }
                  
                  .markdown-body h5 {
                    font-size: 12px;
                  }
                  
                  .markdown-body h6 {
                    font-size: 11px;
                  }
                  
                  .markdown-body blockquote {
                    margin: 0;
                  }
                  
                  .markdown-body ul,
                  .markdown-body ol {
                    padding: 0;
                    margin-top: 0;
                    margin-bottom: 0;
                  }
                  
                  .markdown-body ol ol,
                  .markdown-body ul ol {
                    list-style-type: lower-roman;
                  }
                  
                  .markdown-body ul ul ol,
                  .markdown-body ul ol ol,
                  .markdown-body ol ul ol,
                  .markdown-body ol ol ol {
                    list-style-type: lower-alpha;
                  }
                  
                  .markdown-body dd {
                    margin-left: 0;
                  }
                  
                  .markdown-body code {
                    font: 12px Consolas, "Liberation Mono", Menlo, Courier, monospace;
                  }
                  
                  .markdown-body pre {
                    margin-top: 0;
                    margin-bottom: 0;
                    font: 12px Consolas, "Liberation Mono", Menlo, Courier, monospace;
                  }
                  
                  .markdown-body kbd {
                    background-color: #e7e7e7;
                    background-image: -webkit-linear-gradient(#fefefe, #e7e7e7);
                    background-image: linear-gradient(#fefefe, #e7e7e7);
                    background-repeat: repeat-x;
                    border-radius: 2px;
                    border: 1px solid #cfcfcf;
                    color: #000;
                    padding: 3px 5px;
                    line-height: 10px;
                    font: 11px Consolas, "Liberation Mono", Menlo, Courier, monospace;
                    display: inline-block;
                  }
                  
                  .markdown-body>*:first-child {
                    margin-top: 0 !important;
                  }
                  
                  .markdown-body>*:last-child {
                    margin-bottom: 0 !important;
                  }
                  
                  .markdown-body .anchor {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    display: block;
                    padding-right: 6px;
                    padding-left: 30px;
                    margin-left: -30px;
                  }
                  
                  .markdown-body .anchor:focus {
                    outline: none;
                  }
                  
                  .markdown-body h1,
                  .markdown-body h2,
                  .markdown-body h3,
                  .markdown-body h4,
                  .markdown-body h5,
                  .markdown-body h6 {
                    position: relative;
                    margin-top: 1em;
                    margin-bottom: 16px;
                    font-weight: bold;
                    line-height: 1.4;
                  }
                  
                  .markdown-body h1 .octicon-link,
                  .markdown-body h2 .octicon-link,
                  .markdown-body h3 .octicon-link,
                  .markdown-body h4 .octicon-link,
                  .markdown-body h5 .octicon-link,
                  .markdown-body h6 .octicon-link {
                    display: none;
                    color: #000;
                    vertical-align: middle;
                  }
                  
                  .markdown-body h1:hover .anchor,
                  .markdown-body h2:hover .anchor,
                  .markdown-body h3:hover .anchor,
                  .markdown-body h4:hover .anchor,
                  .markdown-body h5:hover .anchor,
                  .markdown-body h6:hover .anchor {
                    height: 1em;
                    padding-left: 8px;
                    margin-left: -30px;
                    line-height: 1;
                    text-decoration: none;
                  }
                  
                  .markdown-body h1:hover .anchor .octicon-link,
                  .markdown-body h2:hover .anchor .octicon-link,
                  .markdown-body h3:hover .anchor .octicon-link,
                  .markdown-body h4:hover .anchor .octicon-link,
                  .markdown-body h5:hover .anchor .octicon-link,
                  .markdown-body h6:hover .anchor .octicon-link {
                    display: inline-block;
                  }
                  
                  .markdown-body h1 {
                    padding-bottom: 0.3em;
                    font-size: 2.25em;
                    line-height: 1.2;
                    border-bottom: 1px solid #eee;
                  }
                  
                  .markdown-body h2 {
                    padding-bottom: 0.3em;
                    font-size: 1.75em;
                    line-height: 1.225;
                    border-bottom: 1px solid #eee;
                  }
                  
                  .markdown-body h3 {
                    font-size: 1.5em;
                    line-height: 1.43;
                  }
                  
                  .markdown-body h4 {
                    font-size: 1.25em;
                  }
                  
                  .markdown-body h5 {
                    font-size: 1em;
                  }
                  
                  .markdown-body h6 {
                    font-size: 1em;
                    color: #777;
                  }
                  
                  .markdown-body p,
                  .markdown-body blockquote,
                  .markdown-body ul,
                  .markdown-body ol,
                  .markdown-body dl,
                  .markdown-body table,
                  .markdown-body pre {
                    margin-top: 0;
                    margin-bottom: 16px;
                  }
                  
                  .markdown-body hr {
                    height: 4px;
                    padding: 0;
                    margin: 16px 0;
                    background-color: #e7e7e7;
                    border: 0 none;
                  }
                  
                  .markdown-body ul,
                  .markdown-body ol {
                    padding-left: 2em;
                  }
                  
                  .markdown-body ul ul,
                  .markdown-body ul ol,
                  .markdown-body ol ol,
                  .markdown-body ol ul {
                    margin-top: 0;
                    margin-bottom: 0;
                  }
                  
                  .markdown-body li>p {
                    margin-top: 16px;
                  }
                  
                  .markdown-body dl {
                    padding: 0;
                  }
                  
                  .markdown-body dl dt {
                    padding: 0;
                    margin-top: 16px;
                    font-size: 1em;
                    font-style: italic;
                    font-weight: bold;
                  }
                  
                  .markdown-body dl dd {
                    padding: 0 16px;
                    margin-bottom: 16px;
                  }
                  
                  .markdown-body blockquote {
                    padding: 0 15px;
                    color: #777;
                    border-left: 4px solid #ddd;
                  }
                  
                  .markdown-body blockquote>:first-child {
                    margin-top: 0;
                  }
                  
                  .markdown-body blockquote>:last-child {
                    margin-bottom: 0;
                  }
                  
                  .markdown-body table {
                    display: block;
                    width: 100%;
                    overflow: auto;
                    word-break: normal;
                    word-break: keep-all;
                  }
                  
                  .markdown-body table th {
                    font-weight: bold;
                  }
                  
                  .markdown-body table th,
                  .markdown-body table td {
                    padding: 6px 13px;
                    border: 1px solid #ddd;
                  }
                  
                  .markdown-body table tr {
                    background-color: #fff;
                    border-top: 1px solid #ccc;
                  }
                  
                  .markdown-body table tr:nth-child(2n) {
                    background-color: #f8f8f8;
                  }
                  
                  .markdown-body img {
                    max-width: 100%;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                  }
                  
                  .markdown-body code {
                    padding: 0;
                    padding-top: 0.2em;
                    padding-bottom: 0.2em;
                    margin: 0;
                    font-size: 85%;
                    background-color: rgba(0,0,0,0.04);
                    border-radius: 3px;
                  }
                  
                  .markdown-body code:before,
                  .markdown-body code:after {
                    letter-spacing: -0.2em;
                  }
                  
                  .markdown-body pre>code {
                    padding: 0;
                    margin: 0;
                    font-size: 100%;
                    word-break: normal;
                    white-space: pre;
                    background: transparent;
                    border: 0;
                  }
                  
                  .markdown-body .highlight {
                    margin-bottom: 16px;
                  }
                  
                  .markdown-body .highlight pre,
                  .markdown-body pre {
                    padding: 16px;
                    overflow: auto;
                    font-size: 85%;
                    line-height: 1.45;
                    background-color: #f7f7f7;
                    border-radius: 3px;
                  }
                  
                  .markdown-body .highlight pre {
                    margin-bottom: 0;
                    word-break: normal;
                  }
                  
                  .markdown-body pre {
                    word-wrap: normal;
                  }
                  
                  .markdown-body pre code {
                    display: inline;
                    max-width: initial;
                    padding: 0;
                    margin: 0;
                    overflow: initial;
                    line-height: inherit;
                    word-wrap: normal;
                    background-color: transparent;
                    border: 0;
                  }
                  
                  .markdown-body pre code:before,
                  .markdown-body pre code:after {
                    content: normal;
                  }
                  
                  .markdown-body .highlight {
                    background: #fff;
                  }
                  
                  .markdown-body .highlight .mf,
                  .markdown-body .highlight .mh,
                  .markdown-body .highlight .mi,
                  .markdown-body .highlight .mo,
                  .markdown-body .highlight .il,
                  .markdown-body .highlight .m {
                    color: #945277;
                  }
                  
                  .markdown-body .highlight .s,
                  .markdown-body .highlight .sb,
                  .markdown-body .highlight .sc,
                  .markdown-body .highlight .sd,
                  .markdown-body .highlight .s2,
                  .markdown-body .highlight .se,
                  .markdown-body .highlight .sh,
                  .markdown-body .highlight .si,
                  .markdown-body .highlight .sx,
                  .markdown-body .highlight .s1 {
                    color: #df5000;
                  }
                  
                  .markdown-body .highlight .kc,
                  .markdown-body .highlight .kd,
                  .markdown-body .highlight .kn,
                  .markdown-body .highlight .kp,
                  .markdown-body .highlight .kr,
                  .markdown-body .highlight .kt,
                  .markdown-body .highlight .k,
                  .markdown-body .highlight .o {
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .kt {
                    color: #458;
                  }
                  
                  .markdown-body .highlight .c,
                  .markdown-body .highlight .cm,
                  .markdown-body .highlight .c1 {
                    color: #998;
                    font-style: italic;
                  }
                  
                  .markdown-body .highlight .cp,
                  .markdown-body .highlight .cs {
                    color: #999;
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .cs {
                    font-style: italic;
                  }
                  
                  .markdown-body .highlight .n {
                    color: #333;
                  }
                  
                  .markdown-body .highlight .na,
                  .markdown-body .highlight .nv,
                  .markdown-body .highlight .vc,
                  .markdown-body .highlight .vg,
                  .markdown-body .highlight .vi {
                    color: #008080;
                  }
                  
                  .markdown-body .highlight .nb {
                    color: #0086B3;
                  }
                  
                  .markdown-body .highlight .nc {
                    color: #458;
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .no {
                    color: #094e99;
                  }
                  
                  .markdown-body .highlight .ni {
                    color: #800080;
                  }
                  
                  .markdown-body .highlight .ne {
                    color: #990000;
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .nf {
                    color: #945277;
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .nn {
                    color: #555;
                  }
                  
                  .markdown-body .highlight .nt {
                    color: #000080;
                  }
                  
                  .markdown-body .highlight .err {
                    color: #a61717;
                    background-color: #e3d2d2;
                  }
                  
                  .markdown-body .highlight .gd {
                    color: #000;
                    background-color: #fdd;
                  }
                  
                  .markdown-body .highlight .gd .x {
                    color: #000;
                    background-color: #faa;
                  }
                  
                  .markdown-body .highlight .ge {
                    font-style: italic;
                  }
                  
                  .markdown-body .highlight .gr {
                    color: #aa0000;
                  }
                  
                  .markdown-body .highlight .gh {
                    color: #999;
                  }
                  
                  .markdown-body .highlight .gi {
                    color: #000;
                    background-color: #dfd;
                  }
                  
                  .markdown-body .highlight .gi .x {
                    color: #000;
                    background-color: #afa;
                  }
                  
                  .markdown-body .highlight .go {
                    color: #888;
                  }
                  
                  .markdown-body .highlight .gp {
                    color: #555;
                  }
                  
                  .markdown-body .highlight .gs {
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .gu {
                    color: #800080;
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .gt {
                    color: #aa0000;
                  }
                  
                  .markdown-body .highlight .ow {
                    font-weight: bold;
                  }
                  
                  .markdown-body .highlight .w {
                    color: #bbb;
                  }
                  
                  .markdown-body .highlight .sr {
                    color: #017936;
                  }
                  
                  .markdown-body .highlight .ss {
                    color: #8b467f;
                  }
                  
                  .markdown-body .highlight .bp {
                    color: #999;
                  }
                  
                  .markdown-body .highlight .gc {
                    color: #999;
                    background-color: #EAF2F5;
                  }
                  
                  .markdown-body .octicon {
                    font: normal normal 16px octicons-anchor;
                    line-height: 1;
                    display: inline-block;
                    text-decoration: none;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                  }
                  
                  .markdown-body .octicon-link:before {
                    content: '\f05c';
                  }
                  
                  .markdown-body .task-list-item {
                    list-style-type: none;
                  }
                  
                  .markdown-body .task-list-item+.task-list-item {
                    margin-top: 3px;
                  }
                  
                  .markdown-body .task-list-item input {
                    float: left;
                    margin: 0.3em 0 0.25em -1.6em;
                    vertical-align: middle;
                  }
                  
                  @media (min-width: 43.75em) {
                    body {
                      padding: 30px;
                    }
                  }
                   </style>
                   </head> 
                 <body>
                   <article class="markdown-body">`;
            
            
            // Close out the HTML Body
            
            var tail = `</article>
                </body> 
                </html>`;

            // Append the Head, Body and Tail of the final document

            html = head + formatted + tail;

            s3.putObject({
                Bucket: "sereyo.com", //Update the output bucket name here.
                Key: newFileName,
                Body: html,
                ContentType: 'text/html'

            }, (err,data)=>{

                if(err){
                    console.log(err.message);
                }

                else{

                    console.log(data.ETag);
                    console.log("Object uploaded to the output bucket")
                }
            })
        }).catch((err) => {

            console.log(err.message);
        })

    });
}
