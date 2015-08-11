package utils;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.json.JSONObject;

import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;

import static org.elasticsearch.node.NodeBuilder.*;
import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;


/**
 * Created by malexan on 19/01/2015.
 */
public class ESUtils {

    private static final Logger log = Logger.getLogger(ESUtils.class.getName());



    public static void main(String[] args) {
        ESUtils es = new ESUtils();

//        String res = es.get("news","rss","http://www.bbc.co.uk/news/education-31501917");
//
//        log.info(res);
//
        //es.initData("horny");
        //JSONObject q = new JSONObject("{'filtered':{}}");
        //JSONObject q = new JSONObject("{bool:{'must':[{'match':{'instance.role':'atlas'}},{'match':{'type':'createInstance'}}]}}");
        //q.put("filter",new JSONObject("{'type':{'value':'task'}}"));

        //log.info(es.query("envsconf","instance",q));

//        log.info(es.match("envsconf","task","type","createEnv"));
//        log.info(es.update("envsconf","task","AUsDEMhy5mi79R2ZpD6w","status","new"));
//        log.info(es.update("envsconf","task","AUsDEMhy5mi79R2ZpD6w","region","IR"));
        //es.delete("envsconf","task","AUsGwWSHUTpWQYzcJaZt");

//        JSONObject obj = new JSONObject(es.match("envsconf","task","env.name","ir-test"));
//
//        log.info(ln(obj.toString(4));

        //es.delete("envsconf","task","AUsC5_Me5mi79R2ZpD6v");
        //es.initData();

        JSONObject obj = new JSONObject();

        obj.put("name","Michael");
        obj.put("msg", "Hello1");
        es.set("test","test","1",obj.toString());

        String res = es.get("test","test","1");

        es.close();
//        es.set("test","test",obj.toString());

//        try {
//            String task = FileUtils.readFileToString(new File("C:\\dev\\au-runner\\build\\libs\\worker\\processed\\taskTest345.json"));
//            //String template = FileUtils.readFileToString(new File("C:\\dev\\au-runner\\src\\main\\resources\\conf\\envs\\basicEnvTeml.json"));
//            es.set("envsconf","task", new JSONObject(task).toString());
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

//        JSONObject obj = new JSONObject(es.match("envsconf","regionProps","region","IR"));

 //       log.info(ln(obj.toString(4));
//
//        String id = obj.getJSONObject("hits").getJSONArray("hits").getJSONObject(0).getString("_id");
//
//        log.info(ln("get: " + es.get("envsconf","task",id));
//
//        log.info(ln("get: " + es.update("envsconf", "task", id, "region", "IR"));
//
//        log.info(ln("get: " + es.get("envsconf","task",id));
    }

    Client _client;
    Node _node = null;
    public ESUtils(){
       // _client = createTransportClient();

        _client = createNodeClient();

        initData("horny");

    }

    public void close(){
        if(_node != null){
            _node.close();
        }
        else{
            _client.close();
        }
    }

    public Client createTransportClient() {
        Settings settings = ImmutableSettings.settingsBuilder()
                .put("cluster.name", "horny").build();
        return  new TransportClient(settings).addTransportAddress(new InetSocketTransportAddress("localhost", 9300));
    }

    public Client createNodeClient(){

        Settings settings=ImmutableSettings.settingsBuilder().put("path.conf", "conf/es").build();

        NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder().clusterName("horny").data(true).settings(settings);

        _node = nodeBuilder.node();
        _client = _node.client();
        return _client;
    }

    public Client getClient(){
        return _client;
    }

    public void initData(String index){

        try {
            CreateIndexResponse createResponse = _client.admin().indices().create(Requests.createIndexRequest(index)).actionGet();
        }
        catch (Exception e){
            log.info(e.getMessage());
        }

        File dir = new File("conf/es/mapping");

        if(!dir.exists()){
            return;
        }

        FileFilter fileFilter = new WildcardFileFilter("*.json");

        File[] files = dir.listFiles(fileFilter);
        if(files == null){
            log.info("No mapping files found.");
            return;
        }

        for (int i = 0; i < files.length; i++) {
            createMapping(index, files[i]);
        }

    }

//    public void createMapping(String index, String type, String mappingPath) {
//        String mapping = null;
//        try {
//            mapping = IOUtils.toString(ESUtils.class.getClassLoader().getResourceAsStream(mappingPath));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        log.info("mapping: " + mapping);
//        client.admin().indices()
//                .preparePutMapping(index).setType(type).setSource(new JSONObject(mapping).toString()).execute().actionGet();
//    }

    public void createMapping(String index,File json){
        try {
            _client.admin().indices()
                    .preparePutMapping(index)
                    .setType(json.getName().replace(".json",""))
                    .setSource(FileUtils.readFileToString(json))
                    .execute()
                    .actionGet();
            ;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String set(String index,String type,String json){
        return _client.prepareIndex(index,type).setSource(json).execute().actionGet().getId();
    }

    public String set(String index,String type,String id,String json){
        return _client.prepareIndex(index,type,id).setSource(json).execute().actionGet().getId();
    }

    public String get(String index,String type,String id){
        return _client.prepareGet(index, type, id)
                .execute()
                .actionGet().getSourceAsString();
    }

    public String update(String index,String type,String id,String column,String value){
        UpdateRequest updateRequest = new UpdateRequest();
        updateRequest.index(index);
        updateRequest.type(type);
        updateRequest.id(id);
        try {
            updateRequest.doc(jsonBuilder()
                    .startObject()
                    .field(column, value)
                    .endObject());
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            UpdateResponse response = _client.update(updateRequest).get();
            return response.getId();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String match(String index,String type,String name,String value){

        SearchResponse response = _client.prepareSearch(index).setTypes(type).setQuery(QueryBuilders.matchQuery(name, value)).setSize(10000).execute().actionGet();
        return response.toString();
    }

    public String query(String index,String type,JSONObject query){
        return _client.prepareSearch(index).setTypes(type).setQuery(query.toString()).execute().actionGet().toString();
    }

    public String delete(String index,String type,String id){
        return _client.prepareDelete(index, type, id)
                .execute()
                .actionGet().getId();
    }

}
