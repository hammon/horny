package web;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;

//import org.joda.*;

/**
 * Created by michael on 08/02/15.
 */
public class FilesServlet extends HttpServlet {

    final static Logger log = LoggerFactory.getLogger(FilesServlet.class);
    //File root = new File("/home/michael/");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub



        response.setCharacterEncoding("UTF-8");

      //  long start = System.currentTimeMillis();

        String op = request.getParameter("op");

        if(op.equalsIgnoreCase("list")){
            listDir(request,response);
        }
        else if(op.equalsIgnoreCase("mkdir")){
            mkdir(request,response);
        }
        else if(op.equalsIgnoreCase("create")){
            createFile(request,response);
        }
        else if(op.equalsIgnoreCase("rm")){
            delete(request,response);
        }

    }

    void delete(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();

        jsonRes.put("result","SUCCESS");

        String path = request.getParameter("path");

        File root = new File(getServletContext().getAttribute("rootPath").toString());
        File file = new File(root,path);


        try {
            FileUtils.forceDelete(file);
        } catch (IOException e) {
            log.error("Failed to delete " + file.getAbsolutePath(), e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            jsonRes.put("message",e.getMessage());
        }

        //File newFile = new File(currDir,request.getParameter("name"));

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

//        try {
//
//                //jsonRes.put("message",newFile.getAbsolutePath());
//
//
//        } catch (IOException e) {
//
//            //log.error("Failed to create directory " + newFile.getAbsolutePath(),e);
//            response.setStatus(500);
//            jsonRes.put("result","FAILURE");
//            //"Failed to create directory " + newDir.getAbsolutePath() +
//            jsonRes.put("message",e.getMessage());
//            //out.write("Failed to create directory " + newDir.getAbsolutePath() + e.getMessage());
//        }

        out.write(jsonRes.toString());

    }

    void createFile(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();

        jsonRes.put("result","SUCCESS");

        String path = request.getParameter("path");

        File root = new File(getServletContext().getAttribute("rootPath").toString());
        File currDir = new File(root,path);
        File newFile = new File(currDir,request.getParameter("name"));

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        try {
            if(newFile.createNewFile()){
                jsonRes.put("message",newFile.getAbsolutePath());
            }

        } catch (IOException e) {

            log.error("Failed to create directory " + newFile.getAbsolutePath(),e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            //"Failed to create directory " + newDir.getAbsolutePath() +
            jsonRes.put("message",e.getMessage());
            //out.write("Failed to create directory " + newDir.getAbsolutePath() + e.getMessage());
        }

        out.write(jsonRes.toString());

    }

    void mkdir(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();

        jsonRes.put("result","SUCCESS");

        String path = request.getParameter("path");

        File root = new File(getServletContext().getAttribute("rootPath").toString());
        File currDir = new File(root,path);
        File newDir = new File(currDir,request.getParameter("name"));

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        try {
            FileUtils.forceMkdir(newDir);
            jsonRes.put("message",newDir.getAbsolutePath());
        } catch (IOException e) {

            log.error("Failed to create directory " + newDir.getAbsolutePath(),e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            //"Failed to create directory " + newDir.getAbsolutePath() +
            jsonRes.put("message",e.getMessage());
            //out.write("Failed to create directory " + newDir.getAbsolutePath() + e.getMessage());
        }

        out.write(jsonRes.toString());

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
            if(!f.isHidden()) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put("text", f.getName());
                    obj.put("leaf", f.isFile());
                    obj.put("hidden", f.isHidden());
                    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    obj.put("lastModified", df.format(new Date(f.lastModified())));
                    obj.put("length", f.length());

                    //obj.put("checked", true);
                } catch (JSONException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                jsonArr.put(obj);
                //out.println(f.getName());
            }
        }

        //long stop = System.currentTimeMillis();

        //long total = stop - start;

        out.print(jsonArr.toString());
    }
}
