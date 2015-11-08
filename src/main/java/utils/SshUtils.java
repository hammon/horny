package utils;

/**
 * Created by malexan on 18/11/2014.
 */


import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.common.IOUtils;
import net.schmizz.sshj.connection.ConnectionException;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.connection.channel.direct.Session.Command;
import net.schmizz.sshj.transport.TransportException;
import net.schmizz.sshj.transport.verification.HostKeyVerifier;
import net.schmizz.sshj.userauth.UserAuthException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.PublicKey;
import java.security.Security;
import java.util.concurrent.TimeUnit;

//import org.bouncycastle.jce.provider.BouncyCastleProvider;

//http://totalprogus.blogspot.fr/2012/09/crash-could-not-start-crasshd-failed-to.html


public class SshUtils {

    private static final Logger log = LoggerFactory.getLogger(SshUtils.class.getName());

    public static void main(String[] args) {
        SshUtils ssh = new SshUtils();

        try {


        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            String res = ssh.exec("salt-key -L");
            logger.info("RES: " + res);
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            ssh.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    //used to include BouncyCastle into the jar
   // BouncyCastleProvider provider = new BouncyCastleProvider();

    public SshUtils(){
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    }

    private static final Logger logger = LoggerFactory.getLogger(SshUtils.class);

    private String hostName = "";

   // private String host = "IR-P-Atlas-i-cd656529-a.private.mtlink.biz";
    private SSHClient sshClient = new SSHClient();

    public void connect(String hostName,String userName,String keyPath){

        if(sshClient == null){
            sshClient = new SSHClient();
        }

        if(this.hostName.equalsIgnoreCase(hostName)
                && sshClient.isConnected()){
            return;
        }
        else{
            if(sshClient.isConnected()){
                try {
                    disconnect();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }


        sshClient.addHostKeyVerifier(new NullHostKeyVerifier());

        for(int i = 0;i < 180;i++){
            try {
                sshClient.connect(hostName);
                if(sshClient.isConnected()){
                    break;
                }

            } catch (IOException e) {
                log.info("Attempt - " + i + ". Failed to connect to " + hostName + ". " + e.toString() + " Going to sleep for 5 seconds.");
            }

            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        if(new java.io.File(keyPath).exists()){
            try {
                sshClient.authPublickey(userName, keyPath);
            } catch (UserAuthException e) {
                e.printStackTrace();
            } catch (TransportException e) {
                e.printStackTrace();
            }
        }
        else{
            try {
                sshClient.authPassword(userName, keyPath);
            } catch (UserAuthException e) {
                e.printStackTrace();
            } catch (TransportException e) {
                e.printStackTrace();
            }
        }



        if(!sshClient.isConnected()){
            logger.error("Could not connect to " + hostName);
        }
    }

//    public void connect() throws Exception {
//        sshClient.addHostKeyVerifier(new NullHostKeyVerifier());
//        //sshClient.addHostKeyVerifier("ee:2f:44:01:7b:35:ff:0c:2d:75:f5:24:62:34:c5:52");
//        sshClient.connect(host);
//        sshClient.authPublickey("ec2-user", "C:\\Users\\michaela\\Downloads\\atlas-va.ppk");
//    }

    public void disconnect() {
        try {
            sshClient.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
        sshClient = null;
    }


    public String exec(String command) {
        String str = null;

        logger.info("Running {} ", command);


        Session session = null;
        try {

            session = sshClient.startSession();
            session.allocateDefaultPTY();
            final Session.Command cmd = session.exec(command);
            //str = IOUtils.readFully(cmd.getInputStream()).toString();
            str = IOUtils.readFully(session.getInputStream()).toString();
            cmd.join(5, TimeUnit.SECONDS);

            logger.debug("cmd result {}", cmd.getExitStatus());
            logger.debug("Received {}", str);
        } catch (ConnectionException e) {
            e.printStackTrace();
        } catch (TransportException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                session.close();
            } catch (TransportException e) {
                e.printStackTrace();
            } catch (ConnectionException e) {
                e.printStackTrace();
            }
        }

        return str;
    }

    class NullHostKeyVerifier implements HostKeyVerifier {
        @Override
        public boolean verify(String arg0, int arg1, PublicKey arg2) {
            return true;
        }
    }
}
