package utils;

import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.logging.Logger;

/**
 * Created by malexan on 23/11/2014.
 */
public class ProcessUtils {

    final static org.slf4j.Logger log = LoggerFactory.getLogger(ProcessUtils.class);

    public static void main(String args[]) {
        ProcessUtils proc = new ProcessUtils();

       
       // log.info("res:" + res);
    }


    public String exec(String cmd){
        String res = "";

        try {
            String line;
            Process p = Runtime.getRuntime().exec(cmd);
            BufferedReader bri = new BufferedReader
                    (new InputStreamReader(p.getInputStream()));
            BufferedReader bre = new BufferedReader
                    (new InputStreamReader(p.getErrorStream()));
            while ((line = bri.readLine()) != null) {
                //log.info(line);
                res += line + "\n";
            }
            bri.close();
            while ((line = bre.readLine()) != null) {
                //log.info(line);
                res += line  + "\n";
            }
            bre.close();
            p.waitFor();
            log.info("Done.");
        }
        catch (Exception e) {
            log.error("Error executing " + cmd,e);
        }


        return res;
    }
}
