# S3 CORS Configuration

If images are not loading in the frontend, you may need to configure CORS on your S3 bucket.

## Steps to Configure CORS

1. Go to your S3 bucket in the AWS Console
2. Click on the **Permissions** tab
3. Scroll down to **Cross-origin resource sharing (CORS)**
4. Click **Edit** and add the following configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

5. Click **Save changes**

## Verify Public Access

Also ensure your bucket policy allows public read access:

1. Go to **Permissions** tab
2. Click on **Bucket policy**
3. Add or verify you have a policy like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::akimender-storyboard-images/*"
        }
    ]
}
```

Replace `akimender-storyboard-images` with your actual bucket name.

## Test Image Access

After configuring CORS, test if you can access an image directly in your browser:

```
https://akimender-storyboard-images.s3.us-east-2.amazonaws.com/[project-id]/[image-id].png
```

If the image loads in the browser but not in the app, check the browser console for CORS errors.

