package text;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.PropertyConfigurator;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.ESUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 * Created by michael on 9/28/15.
 */
public class ESIndexer {

    final static Logger log = LoggerFactory.getLogger(ESIndexer.class);

    ESUtils _es = new ESUtils("127.0.0.1");

    public static void main(String[] args){

        cli.Horny.configureLogger();

        ESIndexer indexer = new ESIndexer();

        //indexer.indexDir(new File("C:\\github\\horny\\src"), new String[]{"java","js"});

        indexer.index(new File("c:\\vasilisa.txt"));
    }

    public static void configureLogger() {
        Properties p = new Properties();

        try {
            p.load(new FileInputStream("./conf/log4j.properties"));
            PropertyConfigurator.configure(p);
            log.info("Wow! I'm configured!");
        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    void indexDir(File dir,String[] extensions){
        //String[] extensions = {fileExtension};

        log.info("index dir: " + dir.getAbsolutePath());
        Collection<File> files = FileUtils.listFiles(dir, extensions, true);

        for(File f : files){
            index(f);
        }
    }

    void index(File file){

        log.info("index file: " + file.getAbsolutePath());
        //String path = request.getParameter("path");

        //File root = new File(getServletContext().getAttribute("rootPath").toString());
        //File file = new File(root,path);

        String text = null;
        try {
            text = FileUtils.readFileToString(file, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

        //log.info("TEXT: " + text);
        log.info("get ngrams");

        NGram ngram = new NGram(text);

        indexOffsets(ngram,file);

        //JSONObject bulk = new JSONObject();

        log.info("prepare es balk");
        //ESUtils es = (ESUtils)getServletContext().getAttribute("es");
        Client esClient = _es.getClient();

        for(int n = 1;n < 6;n++){
            Map<String,Integer> mapCount =  ngram.getTokensCount(n);

            BulkRequestBuilder bulkRequest = esClient.prepareBulk();
            bulkRequest.request().putHeader("charset", "UTF-8");

            int nCounter = 0;
            Iterator<Map.Entry<String,Integer>> itMapCount =  mapCount.entrySet().iterator();
            while (itMapCount.hasNext())
            //mapCount.forEach((k, v) ->
            {
                nCounter++;
                Map.Entry<String,Integer> kv = itMapCount.next();
                String k = kv.getKey();
                Integer v = kv.getValue();

//              log.info("str: " + k + " count: " + v);
                try {
                    bulkRequest.add(esClient.prepareIndex("horny", "web" + n + "gram")
                        .setSource(jsonBuilder()
                                        .startObject()
                                        .field("str", k)
                                        .field("count", v)
                                        .field("date", new Date())
                                        .field("url", file.getAbsolutePath())
                                        .endObject()
                        )
                    );
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }

                if(nCounter % 5000 == 0){
                    log.info("send " + n + "grams balk counter:  " + nCounter);
                    BulkResponse bulkResponse = bulkRequest.execute().actionGet();
                    if (bulkResponse.hasFailures()) {
                        // process failures by iterating through each bulk response item
                        Iterator<BulkItemResponse> it = bulkResponse.iterator();
                        while (it.hasNext()){
                            BulkItemResponse item = it.next();
                            BulkItemResponse.Failure failure = item.getFailure();
                            if(failure != null){
                                log.error(failure.getMessage());
                            }
                        }
                    }
                    bulkRequest = esClient.prepareBulk();
                    bulkRequest.request().putHeader("charset", "UTF-8");
                }
            }
            //);

            log.info("send ngrams balk");
            BulkResponse bulkResponse = bulkRequest.execute().actionGet();
            if (bulkResponse.hasFailures()) {
                // process failures by iterating through each bulk response item
                Iterator<BulkItemResponse> it = bulkResponse.iterator();
                while (it.hasNext()){
                    BulkItemResponse item = it.next();
                    BulkItemResponse.Failure failure = item.getFailure();
                    if(failure != null){
                        log.error(failure.getMessage());
                    }
                }
            }

            log.info("finished " + n + "-gram balk");
        }
    }

    void indexOffsets(NGram ngram,File file){

        BulkRequestBuilder bulkRequest = _es.getClient().prepareBulk();
        bulkRequest.request().putHeader("charset", "UTF-8");

        Map<Integer,String> offsets = ngram.getOffsets();

        Iterator<Map.Entry<Integer,String>> itOffsets = offsets.entrySet().iterator();

        int nCounter = 0;
        while (itOffsets.hasNext()){
            nCounter++;
            Map.Entry<Integer,String> kv = itOffsets.next();

            Integer k = kv.getKey();
            String v = kv.getValue();

            try {
                bulkRequest.add(_es.getClient().prepareIndex("horny", "offsets")
                    .setSource(jsonBuilder()
                                    .startObject()
                                    .field("offset", k)
                                    .field("str", v)
                                    .field("url", file.getAbsolutePath())
                                    .field("date", new Date())
                                    .endObject()
                    )
                );
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }

            if(nCounter % 5000 == 0){
                log.info("send offsets balk counter:  " + nCounter);
                BulkResponse bulkResponse = bulkRequest.execute().actionGet();
                if (bulkResponse.hasFailures()) {
                    // process failures by iterating through each bulk response item
                    Iterator<BulkItemResponse> it = bulkResponse.iterator();
                    while (it.hasNext()){
                        BulkItemResponse item = it.next();
                        BulkItemResponse.Failure failure = item.getFailure();
                        if(failure != null){
                            log.error(failure.getMessage());
                        }
                    }
                }
                bulkRequest = _es.getClient().prepareBulk();
                bulkRequest.request().putHeader("charset", "UTF-8");
            }
        }

        log.info("send ngrams balk");
        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            // process failures by iterating through each bulk response item
            Iterator<BulkItemResponse> it = bulkResponse.iterator();
            while (it.hasNext()){
                BulkItemResponse item = it.next();
                BulkItemResponse.Failure failure = item.getFailure();
                if(failure != null){
                    log.error(failure.getMessage());
                }
            }
        }

        log.info("finished offsets balk");
    }
}
