package web;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
    //File root = new File("/home/michael/");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub



        response.setCharacterEncoding("UTF-8");

      //  long start = System.currentTimeMillis();

        String op = request.getParameter("op");

        if(op.equalsIgnoreCase("list")){
            listDir(request,response);
        }

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

        //long stop = System.currentTimeMillis();

        //long total = stop - start;

        out.print(jsonArr.toString());
    }
}
