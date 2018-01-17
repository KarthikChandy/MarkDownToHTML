exports.handler = (event, context, callback) => {

    const AWS = require('aws-sdk');
    const marked = require('marked');

    // UPDATE BELOW VALUES
    const regon = 'ap-southeast-2' // Change the region of the Amaszon S3 bucket.
    const out_bucket = 'sereyo.com' //Update the name of the output bucket.

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
        region: regon
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
            // A Sample CSS file has been provided to render the output. Make sure to update the below CSS URL with one of your own liking.

            var head = `<html>
                   <head>
                   <meta charset="utf-8">
                   <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
                   <title>Markdown</title>
                    <link rel="stylesheet" type="text/css" href="https://s3-ap-southeast-2.amazonaws.com/aws-trng-syd/DO-NOT-DELETE-assets/default.css" charset="utf-8"/>
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
                Bucket: out_bucket, //Update the output bucket name here.
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
