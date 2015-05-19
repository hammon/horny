import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.script.*;

/**
 * Created by michael on 4/19/15.
 */
public class JSExecutor {
    final static Logger log = LoggerFactory.getLogger(JSExecutor.class);
    ScriptEngine _engine = new ScriptEngineManager().getEngineByName("nashorn");
    Bindings _bindings = _engine.getBindings(ScriptContext.ENGINE_SCOPE);

    public JSExecutor(){
        _bindings.put("horny",new utils.BasicUtils(_engine));
    }

    Object eval(String script){
        try {
            return _engine.eval(script,_bindings);
        } catch (ScriptException e) {
            log.error("Failed to eval script",e);
        }
        return null;
    }
}
