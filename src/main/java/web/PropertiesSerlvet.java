package web;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Properties;


/**
 * Created by malexan on 08/12/2014.
 */
public class PropertiesSerlvet extends HttpServlet {
    protected void doGet(final HttpServletRequest req, final HttpServletResponse res) throws ServletException, IOException {


        String op = req.getParameter("op");
        File root = new File(getServletContext().getAttribute("rootPath").toString());

        if(op.equalsIgnoreCase("get")){
            String host = req.getParameter("host");
            String path = req.getParameter("path");



//            SshUtils ssh = new SshUtils();
//
//            ssh.connect(host,"ec2-user","C:\\Users\\michaela\\Downloads\\atlas-va.pem");
//
//            String result = ssh.exec("cat " + file);

            Properties props = new Properties();
            props.load(new StringReader(FileUtils.readFileToString(new File(root,path))));

            JSONObject jsonObj = new JSONObject();

            for(String key : props.stringPropertyNames()) {
                String value = props.getProperty(key);
                jsonObj.put(key,value);
                //log.info(ln(key + " => " + value);
            }

            res.getWriter().append(jsonObj.toString());
        }
        else if(op.equalsIgnoreCase("set")){
            String host = req.getParameter("host");
            String json = req.getParameter("json");
        }



    }
}
