import org.apache.log4j.PropertyConfigurator;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.ESUtils;
import web.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by michael on 4/20/15.
 */
public class Jetty {
    final static Logger log = LoggerFactory.getLogger(Jetty.class);
    int _port = 8080;
    String _rootPath = "/";

    public static void main(String[] args) {

        Properties p = new Properties();

        try {
            p.load(new FileInputStream("./conf/log4j.properties"));
            PropertyConfigurator.configure(p);
            log.info("Starting ...");
        } catch (IOException e) {
            e.printStackTrace();

        }

        Jetty jetty = new Jetty();
        jetty.start(8081,"/");///scripts/lib
    }

    public void start(int port){
        _port = port;
        start();
    }

    public void start(int port,String rootPath){
        _port = port;
        _rootPath = rootPath;
        start();
    }

    public void start(){
        try {
            Server server = new Server();

            ServerConnector connector = new ServerConnector(server);
            connector.setPort(_port);

            server.setConnectors(new Connector[]{connector});

            ContextHandler staticContext = new ContextHandler();
            staticContext.setContextPath("/");

            ResourceHandler staticHandler = new ResourceHandler();
            staticHandler.setBaseResource(Resource.newResource(Jetty.class.getClassLoader().getResource("webStatic")));

            staticContext.setHandler(staticHandler);


            ServletContextHandler apiContext = initFlowsServletContextHandler();

            ContextHandlerCollection contexts = new ContextHandlerCollection();

            contexts.setHandlers(new Handler[]{staticContext, apiContext});
            server.setHandler(contexts);

            System.err.println(server.dump());



            server.start();
            server.join();
        }
        catch(Exception e){
            log.error("Jetty Oops...",e);
        }
    }

    private ServletContextHandler initFlowsServletContextHandler() {
        ServletContextHandler apiContext = new ServletContextHandler(ServletContextHandler.SESSIONS);

        ServletHolder servletHolder = new ServletHolder(FilesServlet.class);
        apiContext.addServlet(servletHolder, "/api/files");

        ServletHolder ngramHolder = new ServletHolder(NGramServlet.class);
        apiContext.addServlet(ngramHolder, "/api/ngram");

        ServletHolder charGramHolder = new ServletHolder(CharGramServlet.class);
        apiContext.addServlet(charGramHolder, "/api/chargram");

        ServletHolder getTextHolder = new ServletHolder(TextServlet.class);
        apiContext.addServlet(getTextHolder, "/api/text");


        ServletHolder propsHolder = new ServletHolder(PropertiesSerlvet.class);
        apiContext.addServlet(propsHolder, "/api/props");

        ServletHolder jsonHolder = new ServletHolder(JsonServlet.class);
        apiContext.addServlet(jsonHolder, "/api/json");

        ServletHolder flowHolder = new ServletHolder(FlowServlet.class);
        apiContext.addServlet(flowHolder, "/flow");

        ServletHolder flowActionsHolder = new ServletHolder(FlowActionServlet.class);
        apiContext.addServlet(flowActionsHolder, "/flow/action");

        ServletHolder esHolder = new ServletHolder(EsServlet.class);
        apiContext.addServlet(esHolder, "/es");

        apiContext.setAttribute("rootPath", _rootPath);

//        apiContext.setAttribute("es", new ESUtils());
        return apiContext;
    }

}
