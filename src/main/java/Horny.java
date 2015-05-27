import com.beust.jcommander.JCommander;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.PropertyConfigurator;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by michael on 4/10/15.
 */
public class Horny {
    final static Logger log = LoggerFactory.getLogger(Horny.class);

    public static void main(String[] args) {

        Properties p = new Properties();

        try {
            p.load(new FileInputStream("./conf/log4j.properties"));
            PropertyConfigurator.configure(p);
            log.info("Wow! I'm configured!");
        } catch (IOException e) {
            e.printStackTrace();

        }
        HornyCmd cmd = new HornyCmd();
        new JCommander(cmd,args);

        cmd.parameters.forEach(param -> {
            //System.out.println(param);
            log.info(param);
        });

        if(!cmd.file.isEmpty()){
            try {
                JSExecutor js = new JSExecutor();
                js.eval(FileUtils.readFileToString(new File(cmd.file)));
            } catch (IOException e) {
                log.error("Failed to eval " + cmd.file,e);
            }
        }
        else if(!cmd.eval.isEmpty()){
            JSExecutor js = new JSExecutor();
            js.eval(cmd.eval);
        }
        else if(cmd.port != 0){
            Jetty jetty = new Jetty();
            if(!cmd.rootPath.isEmpty()){
                jetty.start(cmd.port,cmd.rootPath);
            }
            else{
                jetty.start(cmd.port);
            }
        }
    }
}
