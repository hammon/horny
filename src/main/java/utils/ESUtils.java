


package utils;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.apache.commons.lang3.StringEscapeUtils;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsRequest;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.cluster.ClusterState;
import org.elasticsearch.cluster.metadata.IndexMetaData;
import org.elasticsearch.cluster.metadata.MappingMetaData;
import org.elasticsearch.common.collect.ImmutableOpenMap;
import org.elasticsearch.common.hppc.cursors.ObjectObjectCursor;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.json.JSONObject;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;

import static org.elasticsearch.node.NodeBuilder.*;
import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;



/**
 * Created by malexan on 19/01/2015.
 */
public class ESUtils {

    //private static final Logger log = Logger.getLogger(ESUtils.class.getName());
    final static org.slf4j.Logger log = LoggerFactory.getLogger(ESUtils.class);

    Client _client;
    Node _node = null;
    String _clusterName = "horny";

    public ESUtils(){
        // _client = createTransportClient();

        _client = createNodeClient();

        initData(_clusterName);

    }

    public void close(){
        if(_node != null){
            _node.close();
        }
        else{
            _client.close();
        }
    }


    public static void main(String[] args) {

        ESUtils.testEncoding();
        //ESUtils.httpBulk();

//        GetMappingsResponse res = null;
//        try {
//            res = es.getClient().admin().indices().getMappings(new GetMappingsRequest().indices("horny")).get();
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        } catch (ExecutionException e) {
//            e.printStackTrace();
//        }
//        ImmutableOpenMap<String, MappingMetaData> mapping  = res.mappings().get("horny");
//        for (ObjectObjectCursor<String, MappingMetaData> c : mapping) {
//            System.out.println(c.key+" = "+c.value.source());
//        }


//        ClusterState cs = es.getClient().get()    //.admin().cluster()..prepareState()..setFilterIndices("myIndex").execute().actionGet().getState();
//        IndexMetaData imd = cs.getMetaData().index("myIndex");
//        MappingMetaData mdd = imd.mapping("myType");



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

//        JSONObject obj = new JSONObject();
//        obj.put("name","Michael");
//        obj.put("msg", "Hello1");
//        es.set("test","test","1",obj.toString());
//
//        String res = es.get("test","test","1");
//        es.close();



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



    public Client createTransportClient() {
        Settings settings = ImmutableSettings.settingsBuilder()
                .put("cluster.name", _clusterName).build();
        return  new TransportClient(settings).addTransportAddress(new InetSocketTransportAddress("localhost", 9300));
    }

    public Client createNodeClient(){

        Settings settings=ImmutableSettings.settingsBuilder().put("path.conf", "conf/es").build();

        NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder().clusterName(_clusterName).data(true).settings(settings);

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

        //.setSearchType(SearchType.SCAN) .setQuery(query) // <-- Query string in JSON format .execute().actionGet();

        return _client.prepareSearch(index).setTypes(type).setSearchType(SearchType.SCAN).setQuery(query.toString()).execute().actionGet().toString();
    }

    public String delete(String index,String type,String id){
        return _client.prepareDelete(index, type, id)
                .execute()
                .actionGet().getId();
    }

    public static void testEncoding() {

        String testString = "формат";
        HttpUtils http = new HttpUtils();

        Map<String,Charset> charsetsMap =  Charset.availableCharsets();

        Iterator<String> it =  charsetsMap.keySet().iterator();

        while(it.hasNext()){
            String fromCharset = it.next();

            Charset.availableCharsets().forEach((charsetName, toCharset) -> {
                log.info("charsetName: " + charsetName + " charset: " + toCharset.displayName());

                String encodedString = "";
                try{
                    encodedString = new String(testString.getBytes(fromCharset),toCharset);
                }
                catch(Exception e){
                    System.out.println("Error getBytes for charset: " + charsetName + " " + e.toString());
                    log.error("Error getBytes for charset: " + charsetName,e);
                }

                log.info("encodedString: " + encodedString);

                JSONObject obj = new JSONObject();

                obj.put("fromCharset",fromCharset);
                obj.put("toCharset",charsetName);
                obj.put("encodedString",encodedString);

                String result = http.post("http://127.0.0.1:9200/horny/encodingTest",obj.toString());

                log.info(result);

            });
        }

    }

//    // convert from UTF-8 -> internal Java String format
//    public static String convertFromUTF8(String s) {
//        String out = null;
//        try {
//            out = new String(s.getBytes("ISO-8859-1"), "UTF-8");
//        } catch (java.io.UnsupportedEncodingException e) {
//            return null;
//        }
//        return out;
//    }
//
//    // convert from internal Java String format -> UTF-8
//    public static String convertToUTF8(String s) {
//        String out = null;
//        try {
//            out = new String(s.getBytes("ISO-8859-1"),"UTF-8"); //"ISO-8859-1");
//        } catch (java.io.UnsupportedEncodingException e) {
//            return null;
//        }
//        return out;
//    }
//
//
//    public static  String encodeX(String str){
//        String encoded = "";
//
//        return encoded;
//    }

//    public static void  httpBulk(){
//
//        String content = "{ \"index\" : { \"_index\" : \"test\", \"_type\" : \"type1\", \"_id\" : \"1\" } }\n";
//               content += new JSONObject("{ \"field1\" : \"asdasd\" }").toString() + "\n";
//
////               content += "{ \"index\" : { \"_index\" : \"test\", \"_type\" : \"type1\", \"_id\" : \"2\" } }\n";
////        try {
////           // content += new JSONObject("{ \"field1\" : \"" + IOUtils.toString(new StringEntity("мероприятие ","UTF-8").getContent()) + "\" }") + "\n";
////        } catch (IOException e) {
////            e.printStackTrace();
////        }
//
//
//        content += "{ \"index\" : { \"_index\" : \"test\", \"_type\" : \"type1\", \"_id\" : \"3\" } }\n";
//                JSONObject obj  = new JSONObject();
//
//        obj.put("field1", "סבהסבהסבה");
//
//        content += obj.toString() + "\n";
//
//        log.info("content: " + content);
//
////        byte[] bytes = null;
////        try {
////            bytes = content.getBytes("UTF-8");
////        } catch (UnsupportedEncodingException e) {
////            e.printStackTrace();
////        }
////
////        log.info("bytes utf-8: " + bytes.toString());
//
//        HttpUtils http = new HttpUtils();
//
//        Map<String,String> headers = new HashMap();
//        headers.put("Content-Type","application/x-www-form-urlencoded");
//        headers.put("charset", "UTF-8");
//
//        http.post("http://127.0.0.1:9200/_bulk",headers,content);
//    }

//    public static String encode(String s) {
//        StringBuffer sb = new StringBuffer("");
//        for(int i = 0; i < s.length(); i++) {
//            char c = s.charAt(i);
//            if((c >= 0) && (c <=127)) {
//                sb.append(c);
//            } else {
//                sb.append("&#" + Integer.toString(c) + ";");
//            }
//        }
//        return sb.toString();
//    }


}
