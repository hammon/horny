package text;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.elasticsearch.action.ActionRequestValidationException;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.NoNodeAvailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.ESUtils;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 * Created by michael on 10/8/15.
 */
public class MashkovIndexer {

    final static Logger log = LoggerFactory.getLogger(MashkovIndexer.class);

    String _esHost = "127.0.0.1";

    ESUtils _es = new ESUtils(_esHost);

    public static void main(String[] args){
        cli.Horny.configureLogger();

        MashkovIndexer indexer = new MashkovIndexer();
        indexer.indexDir(new File("/home/michael/Documents/mashkovUtf8/INOFANT"));
    }

    void indexDir(File dir){

        log.info("index dir: " + dir.getAbsolutePath());

        File metaFile = new File(dir,".dir");

        if(!metaFile.exists()){
            log.error("Meta file not found !!!");
            return;
        }

        String[] lines = null;
        try {
            List<String> linesList =  FileUtils.readLines(metaFile);
            lines = new String[linesList.size()];
            lines = linesList.toArray(lines);

        } catch (IOException e) {
            log.error("Error: ",e);
        }


        String author = lines[0];

        log.info("AUTHOR: ---- " + author);

        Map<String,String> fileToTitle = new HashMap<>();

        for(int i = 1;i < lines.length;i++){
            String line = lines[i].trim().replace("(hid)","").replace("(","").replace(")","");
            if(line.length() > 0){
                if(line.contains("║")){
                    String[] arr = line.split("║");
                    if(arr.length != 2){
                        log.error("Error parsing line: '" + line + "'");
                        continue;
                    }
                    fileToTitle.put(arr[1].trim(),arr[0].trim());
                }
            }
        }

        File[] files = dir.listFiles();

        for(File f : files){
            if(f.isDirectory()){
                indexDir(f);
            }
            else if( FilenameUtils.getExtension(f.getAbsolutePath()).equals("txt")){

                log.info("Title: " + fileToTitle.get(f.getName()) + " file: " + f.getName());
                index(f,author,fileToTitle.get(f.getName()));
            }

        }
    }

    void index(File file,String author, String title){

        log.info("index file: " + file.getAbsolutePath());

        String text = null;
        try {
            text = FileUtils.readFileToString(file, "UTF-8");
        } catch (IOException e) {
            log.error("Error: ",e);
        }

        //log.info("TEXT: " + text);
        log.info("get ngrams");

        NGram ngram = new NGram(text);

        indexOffsets(ngram,file,author,title);

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
                                                    .field("title", title)
                                                    .field("author", author)
                                                    .field("date", new Date())
                                                    .field("url", file.getAbsolutePath())
                                                    .endObject()
                                    )
                    );
                } catch (UnsupportedEncodingException e) {
                    log.error("Error: ",e);
                } catch (IOException e) {
                    log.error("Error: ",e);
                } catch (Exception e) {
                    log.error("Error: ",e);
                }

                if(nCounter % 10000 == 0){
                    log.info("send " + n + "grams balk counter:  " + nCounter);
                    BulkResponse bulkResponse = getBulkItemResponses(bulkRequest);
                    if (bulkResponse != null && bulkResponse.hasFailures()) {
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

            log.info("send ngrams balk counter:  " + nCounter);
            if(nCounter > 0){
                BulkResponse bulkResponse = getBulkItemResponses(bulkRequest);
                if (bulkResponse != null && bulkResponse.hasFailures()) {
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
            }

            log.info("finished " + n + "-gram balk");
        }
    }

    void indexOffsets(NGram ngram,File file, String author, String title){

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
                                                .field("title", title)
                                                .field("author", author)
                                                .field("url", file.getAbsolutePath())
                                                .field("date", new Date())
                                                .endObject()
                                )
                );
            } catch (UnsupportedEncodingException e) {
                log.error("Error: ",e);
            } catch (IOException e) {
                log.error("Error: ",e);
            } catch (Exception e) {
                log.error("Error: ",e);
            }

            if(nCounter % 10000 == 0){
                log.info("send offsets balk counter: " + nCounter);
                BulkResponse bulkResponse = getBulkItemResponses(bulkRequest);
                if (bulkResponse != null && bulkResponse.hasFailures()) {
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

        log.info("send ngrams balk counter: " + nCounter);
        if(nCounter > 0) {
            BulkResponse bulkResponse = getBulkItemResponses(bulkRequest);
            if (bulkResponse != null && bulkResponse.hasFailures()) {
                // process failures by iterating through each bulk response item
                Iterator<BulkItemResponse> it = bulkResponse.iterator();
                while (it.hasNext()) {
                    BulkItemResponse item = it.next();
                    BulkItemResponse.Failure failure = item.getFailure();
                    if (failure != null) {
                        log.error(failure.getMessage());
                    }
                }
            }
        }

        log.info("finished offsets balk");
    }

    private BulkResponse getBulkItemResponses(BulkRequestBuilder bulkRequest) {
        BulkResponse response = null;
        try{
            response = bulkRequest.execute().actionGet();
        }
        catch(NoNodeAvailableException e){
            log.error("NoNodeAvailableException Error executing bulk!",e);
            _es = new ESUtils(_esHost);
            try{
                response = bulkRequest.execute().actionGet();
            }
            catch(NoNodeAvailableException e1){
                log.error("Error executing bulk!",e1);
            }
        }
        catch (ActionRequestValidationException e){
            log.error("ActionRequestValidationException Error executing bulk!",e);
        }
        catch (Exception e){
            log.error("Error executing bulk!",e);
        }
        return response;
    }
}
