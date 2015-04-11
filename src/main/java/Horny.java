import com.beust.jcommander.JCommander;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    }
}
