package web;

import org.apache.commons.io.FileUtils;
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

import org.apache.commons.lang3.StringEscapeUtils;


/**
 * Created by michael on 12/02/15.
 */
public class TextServlet extends HttpServlet {

    final static Logger log = LoggerFactory.getLogger(TextServlet.class);

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        File root = new File(getServletContext().getAttribute("rootPath").toString());

        response.setCharacterEncoding("UTF-8");

        String op = "get";

        String sEscapeHtml = "false";

        if(request.getParameterMap().containsKey("op")){
            op = request.getParameter("op");
        }

        if(request.getParameterMap().containsKey("escapeHtml")){
            sEscapeHtml = request.getParameter("escapeHtml");
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

            String text = FileUtils.readFileToString(file);

            if(sEscapeHtml.equalsIgnoreCase("true")){
                text = StringEscapeUtils.escapeHtml4(text);
            }



            out.print(text);
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

            log.info("props save json data: " + jb.toString());

            File file = new File(root,path);

            try {
                FileUtils.writeStringToFile(file,jb.toString());
                resp.setStatus(HttpServletResponse.SC_OK);
            } catch (IOException e) {
                log.error("Failed to save " + file.getAbsolutePath(),e);
                resp.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            }

        }

        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
