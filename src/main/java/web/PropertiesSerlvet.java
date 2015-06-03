package web;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.Properties;


/**
 * Created by malexan on 08/12/2014.
 */
public class PropertiesSerlvet extends HttpServlet {

    final static Logger log = LoggerFactory.getLogger(PropertiesSerlvet.class);

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

    protected void doPost(HttpServletRequest req, HttpServletResponse resp){
        String op = req.getParameter("op");
        String path = req.getParameter("path");
        File root = new File(getServletContext().getAttribute("rootPath").toString());

        if(op.equalsIgnoreCase("save")){

            StringBuffer jb = new StringBuffer();
            String line = null;
            try {
                BufferedReader reader = req.getReader();
                while ((line = reader.readLine()) != null)
                    jb.append(line);
            } catch (Exception e) {
                log.error("Failed read json data :(",e);
            }

            log.info("props save json data: " + jb.toString());

            try {
                Properties props = new Properties();
                JSONArray jsonArr = new JSONArray(jb.toString());

                for(int i = 0;i < jsonArr.length();i++){
                    JSONObject obj = jsonArr.getJSONObject(i);
                    props.setProperty(obj.getString("name"),obj.getString("value"));
                }
                props.store(new FileOutputStream(new File(root,path)),null);

            } catch (Exception e) {

                // crash and burn
               log.error("Failed to parse json :(",e);
            }
        }

        resp.setStatus(HttpServletResponse.SC_OK);
    }

}
