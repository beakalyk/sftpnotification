const Client = require('node-sftp-client');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Set up SFTP client
const sftp = new Client();
const remoteFilePath = '/data';
const localFilePath = '/home/beakaly/Documents';
const sftpConfig = {
  host: '20.201.34.153',
  port: 22,
  username: 'T-ZKTECO_INT-PRD ',
  password: 'XSAcMUrS2jf5IdB3aPDvk',
};

// Set up email client
const transporter = nodemailer.createTransport({
  host: 'mx08-00031601.pphosted.com',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: '',
  },
});

// Cron job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    // Connect to SFTP server and download file
    await sftp.connect(sftpConfig);
    await sftp.get(remoteFilePath, localFilePath);

    // Send email with file attachment
    const mailOptions = {
      from: 'beakaly@devsrv.com',
      to: 'beakaly@moenco.com.et',
      subject: 'File from SFTP server',
      text: 'Please find attached the file downloaded from the SFTP server',
      attachments: [
        {
          filename: 'file.txt',
          path: localFilePath,
        },
      ],
    };
    await transporter.sendMail(mailOptions);

    console.log('File downloaded and email sent');
  } catch (err) {
    console.error(err.message);
  } finally {
    // Disconnect from SFTP server
    await sftp.end();
  }
});
