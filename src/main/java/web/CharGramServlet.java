package web;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import text.CharGram;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by michael on 10/02/15.
 */
public class CharGramServlet extends HttpServlet {
    //File root = new File("/home/michael/");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        File root = new File(getServletContext().getAttribute("rootPath").toString());

        response.setCharacterEncoding("UTF-8");

        //  long start = System.currentTimeMillis();

        String path = request.getParameter("path");

        File file = new File(root,path);

        Map<String,Integer> strCount = CharGram.getCount(FileUtils.readFileToString(file),1);

        Iterator<Map.Entry<String,Integer>> it =  strCount.entrySet().iterator();

        JSONArray jsonArr = new JSONArray();

        while (it.hasNext()){
            Map.Entry<String,Integer> entry = it.next();
            JSONObject obj = new JSONObject();

            obj.put("str",entry.getKey());
            obj.put("count",entry.getValue());

            jsonArr.put(obj);

        }

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            e.printStackTrace();
        }

        out.print(jsonArr.toString());

    }
}
