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
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;


/**
 * Created by michael on 12/02/15.
 */
public class JsonServlet extends HttpServlet {

    final static Logger log = LoggerFactory.getLogger(JsonServlet.class);

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        //just in case ...
        /*
        * deal with the nasty first char
        * http://stackoverflow.com/questions/4773663/jsonobject-text-must-begin-with
        * objectString.substring(objectString.indexOf('{'))
        * */
//        if((int)data.trim().charAt(0) == 65279){
//            data = data.trim().substring(1);
//        }

//        data = data.substring(data.indexOf('{'));

        File root = new File(getServletContext().getAttribute("rootPath").toString());

        response.setCharacterEncoding("UTF-8");

        String op = "get";

        if(request.getParameterMap().containsKey("op")){
            op = request.getParameter("op");
        }

        //  long start = System.currentTimeMillis();

        String path = request.getParameter("path");

        File file = new File(root,path);


        if(op.equalsIgnoreCase("get")){
            PrintWriter out = null;
            try {
                out = response.getWriter();
            } catch (IOException e) {
                e.printStackTrace();
            }

            String jsonStr = FileUtils.readFileToString(file);

            if(jsonStr.trim().startsWith("{")){
                JSONObject obj = new JSONObject(jsonStr);
                out.print(obj.toString(4));
            }
            else if(jsonStr.trim().startsWith("[")){
                JSONArray arr = new JSONArray(jsonStr);
                out.print(arr.toString(4));
            }
            else{
                out.print("{'error':'Invalid JSON'}");
            }

        }
        response.setStatus(HttpServletResponse.SC_OK);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        String op = req.getParameter("op");
        String path = req.getParameter("path");
        File root = new File(getServletContext().getAttribute("rootPath").toString());

        if (op.equalsIgnoreCase("save")) {

            StringBuffer jb = new StringBuffer();
            String line = null;
            try {
                BufferedReader reader = req.getReader();
                while ((line = reader.readLine()) != null)
                    jb.append(line);
            } catch (Exception e) {
                log.error("Failed read json data :(", e);
            }

            String jsonStr = jb.toString();
            log.info("props save json data: " + jsonStr);

            if(jsonStr.trim().startsWith("{")){
                JSONObject obj = new JSONObject(jsonStr);
                jsonStr = obj.toString(4);
            }
            else if(jsonStr.trim().startsWith("[")){
                JSONArray arr = new JSONArray(jsonStr);
                jsonStr = arr.toString(4);
            }

            File file = new File(root,path);

            try {
                FileUtils.writeStringToFile(file,jsonStr);
                resp.setStatus(HttpServletResponse.SC_OK);
            } catch (IOException e) {
                log.error("Failed to save " + file.getAbsolutePath(),e);
                resp.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            }
        }
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
