package utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.management.*;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import java.io.IOException;
import java.net.MalformedURLException;


/**
 * Created by malexan on 14/12/2014.
 */
public class JmxUtils {

    private static final Logger log = LoggerFactory.getLogger(JmxUtils.class.getName());

    public static void main(String[] args) {

        JmxUtils jmx = new JmxUtils();

    }



    private static void test() {
        String serverAddr = "xxx";
        String jmxPort = "xxxx";
        String jmxRmiStr = "service:jmx:rmi://" + serverAddr + ':' + jmxPort + "/jndi/rmi://" + serverAddr + ':' + jmxPort + "/jmxrmi";

        try {

            ObjectName objectName = new ObjectName("aaa");
            JMXServiceURL jmxUrl = null;

            jmxUrl = new JMXServiceURL("http://yyy:5510");

            JMXConnector jmxConnector = JMXConnectorFactory.connect(jmxUrl);
            MBeanServerConnection mbsc = jmxConnector.getMBeanServerConnection();

            //  Create object name
//            ObjectName  destMgrConfigName
//                    = new ObjectName(MQObjectName.DESTINATION_MANAGER_CONFIG_MBEAN_NAME);

            //  Create and populate attribute list





        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (MalformedObjectNameException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String invoke(String server, String port, String objName, String operationName, Object[] opParams, String[] opSig){
        String res = "";
        String jmxRmiStr = "service:jmx:rmi://" + server + ':' + port + "/jndi/rmi://" + server + ':' + port + "/jmxrmi";

        try {
            ObjectName objectName = new ObjectName(objName);
            JMXServiceURL jmxUrl = null;

            jmxUrl = new JMXServiceURL(jmxRmiStr);

            JMXConnector jmxConnector = JMXConnectorFactory.connect(jmxUrl);
            MBeanServerConnection mbsc = jmxConnector.getMBeanServerConnection();

            res = mbsc.invoke(objectName,operationName,opParams,opSig).toString();

            log.info(res);

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (MalformedObjectNameException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (MBeanException e) {
            e.printStackTrace();
        } catch (ReflectionException e) {
            e.printStackTrace();
        } catch (InstanceNotFoundException e) {
            e.printStackTrace();
        }

        return res;
    }
    public String getAttribute(String serverAddr,Integer jmxPort,String objectName,String attributeName){
        //String serverAddr = "CA-T-Atlas-i-0d0a3852-c.public.mtlink.biz";
        //String jmxPort = "5512";
        String res = "ERROR";
        String jmxRmiStr = "service:jmx:rmi://" + serverAddr + ':' + jmxPort + "/jndi/rmi://" + serverAddr + ':' + jmxPort + "/jmxrmi";

        try {

            ObjectName objName = new ObjectName(objectName);
            JMXServiceURL jmxUrl = null;

            jmxUrl = new JMXServiceURL(jmxRmiStr);

            JMXConnector jmxConnector = JMXConnectorFactory.connect(jmxUrl);
            MBeanServerConnection mbsc = jmxConnector.getMBeanServerConnection();

            res = mbsc.getAttribute(objName,attributeName).toString();

            //log.info(ln(res);



        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (MalformedObjectNameException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (AttributeNotFoundException e) {
            e.printStackTrace();
        } catch (MBeanException e) {
            e.printStackTrace();
        } catch (ReflectionException e) {
            e.printStackTrace();
        } catch (InstanceNotFoundException e) {
            e.printStackTrace();
        }
        return res;
    }
}
