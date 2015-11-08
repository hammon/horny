
var hostname = "";
var username = "ec2-user";
var password = "";

ssh.connect(hostname,username,password);

ssh.exec("mkdir tools");

uploadFile("horny.tar.gz","/home/ec2-user/tools");

ssh.exec("cd tools;tar -zxvf horny.tar.gz");

//ssh.exec();

ssh.disconnect();

function uploadFile(localPath,remotePath){

    ssh.upload(localPath,remotePath);

}