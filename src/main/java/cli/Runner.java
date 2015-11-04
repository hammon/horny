package cli;

import org.apache.commons.io.FileUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.Enumeration;
import java.util.Properties;

/**
 * Created by michael on 11/2/15.
 */
public class Runner {
    final static Logger log = LoggerFactory.getLogger(Runner.class);
    public String exec(String cmd){
        if(new File("cmd").exists()){
            return exec(new File("cmd"));
        }
        return "??";
    }

    public String exec(File file){
        if(!file.exists()){

        }

        log.info("execc file: " + file.getAbsolutePath());
        if(file.getName().toLowerCase().endsWith(".json")){
            JSONObject json;
            try {
                json = new JSONObject(FileUtils.readFileToString(file));

            } catch (IOException e) {
                log.error("Failed to parse json file: " + file.getAbsolutePath(),e);
            }
        }
        return "??";
    }

    public Properties loadProperties(File file){
        Properties props = new Properties();
        try {
            props.load(new StringReader(FileUtils.readFileToString(file, "UTF-8")));
        } catch (IOException e) {
            log.error("Failed to load " + file.getAbsolutePath(),e);
        }
        return props;
    }

    public String resolveVars(String str,Properties props){
        Enumeration keys = props.keys();
        while (keys.hasMoreElements()){
            String key = (String) keys.nextElement();
            str = str.replace("${" + key + "}",props.getProperty(key));
        }
        return str;
    }

    public String execJs(File file){
        if(!file.exists()){

        }

        JSExecutor jsExec = new JSExecutor();
        try {
            return jsExec.eval(FileUtils.readFileToString(file)).toString();
        } catch (IOException e) {
            log.error("Failed to execute js: " + file.getAbsolutePath(),e);
        }

        return "??";
    }
}
