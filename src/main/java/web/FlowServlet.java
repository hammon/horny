package web;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.json.JSONArray;
import org.json.JSONException;
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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;


/**
 * Created by michael on 12/02/15.
 */
public class FlowServlet extends HttpServlet {

    final static Logger log = LoggerFactory.getLogger(FlowServlet.class);

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

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to create flow.",e);
        }


        File root = new File(getServletContext().getAttribute("rootPath").toString());

        response.setCharacterEncoding("UTF-8");

        String op = "get";

        if(request.getParameterMap().containsKey("op")){
            op = request.getParameter("op");
        }

        //  long start = System.currentTimeMillis();

        String path = request.getParameter("path");

        File file = new File(root,path);


        if(op.equalsIgnoreCase("list")){
            listDir(request,response);
        }
        else if(op.equalsIgnoreCase("get")){


//            String jsonStr = FileUtils.readFileToString(file);
//
//            if(jsonStr.trim().startsWith("{")){
//                JSONObject obj = new JSONObject(jsonStr);
//                out.print(obj.toString(4));
//            }
//            else if(jsonStr.trim().startsWith("[")){
//                JSONArray arr = new JSONArray(jsonStr);
//                out.print(arr.toString(4));
//            }
//            else{
//                out.print("{'error':'Invalid JSON'}");
//            }
        }
        else if(op.equalsIgnoreCase("create")){
            String name = "NewFlow";

            if(request.getParameterMap().containsKey("name")){
                name = request.getParameter("name");
            }

            JSONObject objFlow = new JSONObject();

            objFlow.put("name",name);
            objFlow.put("type","flow");
            objFlow.put("steps",new JSONArray());


            File flowDir = new File(root,path);
            File flowFile = new File(flowDir,name + ".json");

            String jsonStr = objFlow.toString(4);

            try {
                FileUtils.writeStringToFile(flowFile,jsonStr);
                response.setStatus(HttpServletResponse.SC_OK);
                out.print(jsonStr);
            } catch (IOException e) {
                log.error("Failed to save " + flowFile.getAbsolutePath(),e);
                out.print("{'error':'Invalid JSON'}");
                response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            }
        }

        response.setStatus(HttpServletResponse.SC_OK);
    }

    void listDir(HttpServletRequest request, HttpServletResponse response){
        String path = request.getParameter("path");

        Enumeration<String> en = request.getAttributeNames();

//        while(en.hasMoreElements()){
//            log(en.nextElement());
//        }

        File root = new File(getServletContext().getAttribute("rootPath").toString());

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            e.printStackTrace();
        }

        File currDir = new File(root,path);

        File[] list = currDir.listFiles();

        JSONArray jsonArr = new JSONArray();

        for(File f : list){
            if(!f.isHidden()){
                JSONObject obj = new JSONObject();
                try {
                    String extension = FilenameUtils.getExtension(f.getAbsolutePath());
                    String name = f.getName();

                    if(f.isDirectory()){
                        obj.put("type", "directory");
                    }
                    else if(extension.equalsIgnoreCase("json")){
                        name = FilenameUtils.getBaseName(f.getAbsolutePath());
                        obj.put("type", "flow");
                    }

                    obj.put("text", name);
                    obj.put("leaf", f.isFile());
                    obj.put("hidden", f.isHidden());
                    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    obj.put("lastModified", df.format(new Date(f.lastModified())));
                    obj.put("length", f.length());

                    //obj.put("checked", true);
                } catch (JSONException e) {
                    log.error("Error adding file to json",e);
                }
                jsonArr.put(obj);
            }

            //out.println(f.getName());
        }

        //long stop = System.currentTimeMillis();

        //long total = stop - start;

        out.print(jsonArr.toString());
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
