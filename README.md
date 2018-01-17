---
author: Karthik Chandy
date: 16-Jan-2018
title: AWS Lambda MarkDown to HTML Converter
coding: utf-8
---

# AWS Lambda MarkDown to HTML Converter
This Node.js application automates the process of converting MarkDown files into HTML. Amazon S3 events invoke an AWS Lambda function to process the MarkDown file. The process is explained in the below diagram.

![Demo Summary](images/Flow.JPG)

1. Create a folder called **MarkDownToHTML** and continue to perform all the below operations in the same folder.

2. Update the `src/index.js` file with appropriate values and then copy the file to the MarkDownToHTML directory.

   **NOTE:** Make sure to replace values marked as comments.

```js
....
    const marked = require('marked');

    // UPDATE BELOW VALUES
    const regon = 'ap-southeast-2' // Change the region of the Amaszon S3 bucket.
    const out_bucket = 'bucket_name' //Update the name of the output bucket.

.....

        // Generate the HTML Header, Style & Body
        // A Sample CSS file has been provided to render the output. Make sure to update the below CSS URL with one of your own liking.

.....
                   <title>Markdown</title>
                    <link rel="stylesheet" type="text/css" href="https://s3-ap-southeast-2.amazonaws.com/aws-trng-syd/DO-NOT-DELETE-assets/default.css" charset="utf-8"/>
                   </head> 
.....
}
```

3. On the **Terminal** find your way to the directory.

    **E.G :** ` cd MarkDownToHTML`

4. Run the following command `npm init` and provide the relevant information. The resulting `package.json` file should look like the below output.

```json
{
  "name": "markdowntohtml",
  "version": "1.0.0",
  "description": "This application converts a MarkDown file to HTML.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "MarkDown",
    "MD",
    "HTML"
  ],
  "author": "Enter author name.",
  "license": "LICENSED",
  "dependencies": {
    "marked": "^0.3.x"
  }
}
```

5. While in the same directory, run the following command. This will install [marked](https://www.npmjs.com/package/marked) that is a full-featured markdown parser and compiler, written in JavaScript.This step should create a `package-lock.json` file.

    `npm install marked`

6. Create a .zip file by selecting all the files and directory. 

7. Create a Node.js 6 based AWS Lambda Function and make sure the function name matches the name of the .zip file created in the last step. More information can be found [here](https://docs.aws.amazon.com/lambda/latest/dg/get-started-create-function.html). 

8. Create a source Amazon S3 bucket. Steps [here](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

9. Create an Amazon S3 event notification to notify the previously created AWS Lambda function, only when a file with a .md extension is created in the source Amazon S3 bucket. s3-event.JPG
    - **Events** - ObjectCreate(All)
    - **Suffix** - md
    - **Send to** - Lambda Function
    - **Lambda** - Select the name of the Lambda Function.

  ![Amazon S3 Events](images/s3-event.JPG "Amazon S3 Events")

10. All set. Now upload a Mark Down file to the source bucket and see the HTML output in the destination bucket.
    
    **NOTE:** The output of the resulting HTML file will depend on the CSS file that was used. 
