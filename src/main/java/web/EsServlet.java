package web;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.http.util.EncodingUtils;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import text.NGram;
import utils.ESUtils;
import utils.HttpUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
//import org.joda.*;

/**
 * Created by michael on 08/02/15.
 */
public class EsServlet extends HttpServlet {

    final static Logger log = LoggerFactory.getLogger(EsServlet.class);
    //File root = new File("/home/michael/");

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        response.setCharacterEncoding("UTF-8");

      //  long start = System.currentTimeMillis();

        String op = request.getParameter("op");

        switch(op){
            case "delete":
                delete(request, response);
                break;
            case "index":
                index(request, response);
                break;
            case "mapping":
                mapping(request, response);
                break;
            case "update":
                update(request, response);
                break;
            case "set":
                //set(request, response);
                break;

        }


    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) {

        response.setCharacterEncoding("UTF-8");

        String op = request.getParameter("op");

        switch(op){

            case "set":
                setEsRecord(request, response);
                break;
            case "search":
                search(request, response);
                break;

        }
    }

    void mapping(HttpServletRequest request, HttpServletResponse response){
        JSONObject jsonRes = new JSONObject();
        jsonRes.put("result","SUCCESS");

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        String path = request.getParameter("path");
        if(path == null || path.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","path in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        if(path.length() > 1){
            if(!path.endsWith("/")){
                path += "/";
            }

            if(!path.startsWith("/")){
                path = "/" + path;
            }
        }

        HttpUtils http = new HttpUtils();
        out.write(http.get("http://127.0.0.1:9200" + path + "_mapping"));
    }

    void index(HttpServletRequest request, HttpServletResponse response){
        String path = request.getParameter("path");

        File root = new File(getServletContext().getAttribute("rootPath").toString());
        File file = new File(root,path);

        String text = null;
        try {
            text = FileUtils.readFileToString(file,"UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

        log.info("TEXT: " + text);
        log.info("get ngrams");

        NGram ngram = new NGram(text);

        //JSONObject bulk = new JSONObject();

        log.info("prepare es balk");
        ESUtils es = (ESUtils)getServletContext().getAttribute("es");
        Client esClient = es.getClient();

//        for(int n = 1;n < 6;n++){
//            Map<String,Integer> nCount =  ngram.getTokensCount(n);
//            BulkRequestBuilder bulkRequest = esClient.prepareBulk();
//
//            final int finalN = n;
//            nCount.forEach((k,v) ->{
//
//                log.info("str: " + k + " count: " + v);
//
//                JSONObject obj = new JSONObject();
//                obj.put("str",k);
//                obj.put("count",v);
//                obj.put("date",new Date());
//                obj.put("url",file.getAbsolutePath());
//
//                bulkRequest.add(esClient.prepareIndex("horny", "web" + finalN + "gram")
//                                .setSource(obj.toString())
//                );
//
////                    bulkRequest.add(esClient.prepareIndex("horny","web" + finalN + "gram")
////                                    .setSource(jsonBuilder()
////                                                    .startObject()
////                                                    .field("str", k)
////                                                    .field("count", v)
////                                                    .field("date", new Date())
////                                                    .field("url", file.getAbsolutePath())
////                                                    .endObject()
////                                    )
////                    );
//            });
//
//            log.info("send ngrams balk");
//            BulkResponse bulkResponse = bulkRequest.execute().actionGet();
//            if (bulkResponse.hasFailures()) {
//                // process failures by iterating through each bulk response item
//                Iterator<BulkItemResponse> it = bulkResponse.iterator();
//                while (it.hasNext()){
//                    BulkItemResponse item = it.next();
//                    BulkItemResponse.Failure failure = item.getFailure();
//                    if(failure != null){
//                        log.error(failure.getMessage());
//                    }
//                }
//            }
//            log.info("finished " + n + "-gram balk");
//        }
    }

    void update(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();
        jsonRes.put("result","SUCCESS");

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        String esIndex = request.getParameter("index");
        if(esIndex == null || esIndex.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", "index in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String esType = request.getParameter("type");
        if(esType == null || esType.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","type in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String esId = request.getParameter("id");
        if(esId == null || esId.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","id in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String column = request.getParameter("column");
        if(esId == null || esId.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","column in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String value = request.getParameter("value");
        if(esId == null){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","value in null.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        ESUtils es = (ESUtils)getServletContext().getAttribute("es");
        try {
            String result = es.update(esIndex,esType,esId,column,value);
            jsonRes.put("message", result);
        } catch (Exception e) {
            log.error("Failed to delete " + esIndex + "/" + esType + "/" + esId, e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", e.getMessage());
        }
        out.write(jsonRes.toString());
    }

    void delete(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();
        jsonRes.put("result","SUCCESS");

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        String esIndex = request.getParameter("index");
        String esType = request.getParameter("type");
        String esId = request.getParameter("id");

        if(esIndex == null || esIndex.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", "index in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        if((esType == null || esType.isEmpty())
                && (esId == null || esId.isEmpty())){

            HttpUtils http = new HttpUtils();
            out.write(http.delete("http://127.0.0.1:9200/" + esIndex));
            return;

        }


        if(esType == null || esType.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","type in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }


        if(esId == null || esId.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","id in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        ESUtils es = (ESUtils)getServletContext().getAttribute("es");
        try {
            String result = es.delete(esIndex, esType, esId);
            jsonRes.put("message", result);
        } catch (Exception e) {
            log.error("Failed to delete " + esIndex + "/" + esType + "/" + esId, e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", e.getMessage());
        }
        out.write(jsonRes.toString());
    }


    void setEsRecord(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();
        jsonRes.put("result","SUCCESS");

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            log.error("Failed read json data :(",e);
        }

        JSONObject recJson = new JSONObject(jb.toString());

        log.info("props save json data: " + jb.toString());

        String esIndex = request.getParameter("index");
        if(esIndex == null || esIndex.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", "index in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String esType = request.getParameter("type");
        if(esType == null || esType.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","type in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String esId = request.getParameter("id");


        ESUtils es = (ESUtils)getServletContext().getAttribute("es");
        try {
            if(esId == null || esId.isEmpty()){
                String result = es.set(esIndex, esType, recJson.toString());
                jsonRes.put("message", result);
            }
            else{
                String result = es.set(esIndex, esType, esId, recJson.toString());
                jsonRes.put("message", result);
            }


        } catch (Exception e) {
            log.error("Failed to delete " + esIndex + "/" + esType + "/" + esId, e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", e.getMessage());
        }
        out.write(jsonRes.toString());
    }

    void search(HttpServletRequest request, HttpServletResponse response){

        JSONObject jsonRes = new JSONObject();
        jsonRes.put("result","SUCCESS");

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            log.error("Failed to get writer", e);
        }

        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                //jb.append(new String(line.getBytes("UTF-8"),"CESU-8"));
                jb.append(new String(line.getBytes("UTF-8")));
        } catch (Exception e) {
            log.error("Failed read json data :(",e);
        }

//        try {
//            log.info("search queryJson: " + new String(jb.toString().getBytes("CESU-8"), "UTF-8"));
//           // ESUtils.testEncoding(jb.toString());
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }

        String strJson = StringEscapeUtils.unescapeJava(jb.toString());

        log.info("search queryJson: " + strJson);

 //       JSONObject queryJson = new JSONObject(strJson);


        String esIndex = request.getParameter("index");
        if(esIndex == null || esIndex.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", "index in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        String esType = request.getParameter("type");
        if(esType == null || esType.isEmpty()){
            jsonRes.put("result","FAILURE");
            jsonRes.put("message","type in null or empty.");
            response.setStatus(500);
            out.write(jsonRes.toString());
            return;
        }

        try {
//            ESUtils es = (ESUtils)getServletContext().getAttribute("es");
//            String result = es.query(esIndex,esType,new JSONObject(strJson));

            HttpUtils http = new HttpUtils();
            Map<String,String> headers = new HashMap<>();
            headers.put("Content-Type", "application/x-www-form-urlencoded");

           // String encodedQuery = URLEncoder.encode(strJson, "UTF-8");

            String result = http.post("http://127.0.0.1:9200/" + esIndex + "/" + esType + "/_search",headers, strJson);//es.query(esIndex,esType,queryJson);



            //jsonRes.put("message", result);
            //out.write(new String(result.getBytes("UTF-8"),"ISO-8859-1"));
            out.write(result);
            return;

        } catch (Exception e) {
            log.error("Failed to query " + esIndex + "/" + esType + "/" + strJson, e);
            response.setStatus(500);
            jsonRes.put("result","FAILURE");
            jsonRes.put("message", e.getMessage());
        }
        out.write(jsonRes.toString());
    }

}
