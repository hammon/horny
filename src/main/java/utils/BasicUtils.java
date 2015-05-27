package utils;

import org.apache.commons.io.FileUtils;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * Created by michael on 19/10/2014.
 */
public class BasicUtils {
    private static final Logger log = Logger.getLogger(BasicUtils.class.getName());
    ScriptEngine _engine = null;
    public BasicUtils(ScriptEngine engine){
        _engine = engine;
    }

    public void load(String path) throws FileNotFoundException {

        if(!new File(path).exists()){
            throw new FileNotFoundException("BasicUtils.load did not find " + path);
        }

        try {
            log.info("BasicUtils.load " + path);
            //_engine.eval(new FileReader(path),_engine.getBindings( ScriptContext.GLOBAL_SCOPE ));
            _engine.eval(readFile(path),_engine.getBindings( ScriptContext.ENGINE_SCOPE ));
        } catch (ScriptException e) {
            e.printStackTrace();
        }
    }

    public String readFile(String path){
        try {
            return FileUtils.readFileToString(new File(path));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public String getWorkingDir() throws IOException {
        return new File(".").getCanonicalPath();
    }

    public void sleep(long millis){
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void printToLog(String msg){
        log.info(msg);
    }
}
