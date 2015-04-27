package web;

import org.apache.commons.io.FileUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;


/**
 * Created by michael on 12/02/15.
 */
public class GetTextServlet extends HttpServlet {
    //File root = new File("/home/michael/");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        File root = new File(getServletContext().getAttribute("rootPath").toString());

        response.setCharacterEncoding("UTF-8");

        //  long start = System.currentTimeMillis();

        String path = request.getParameter("path");

        File file = new File(root,path);

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            e.printStackTrace();
        }

        out.print(FileUtils.readFileToString(file));

    }
}
