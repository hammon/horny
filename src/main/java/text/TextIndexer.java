package text;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

/**
 * Created by michael on 10/15/15.
 */
public class TextIndexer {
    final static Logger log = LoggerFactory.getLogger(TextIndexer.class);

    public static void main(String[] args){
        ///home/michael/Documents/BULGAKOW
        cli.Horny.configureLogger();

        TextIndexer indexer = new TextIndexer();
        indexer.index(new File("/home/michael/Documents/BULGAKOW/dnewnik.txt"));
    }

    void indexDir(File dir,String[] extensions){
        //String[] extensions = {fileExtension};

        log.info("index dir: " + dir.getAbsolutePath());
        Collection<File> files = FileUtils.listFiles(dir, extensions, true);

        for(File f : files){
            index(f);
        }
    }

    void index(File file) {

        log.info("index file: " + file.getAbsolutePath());

        String text = null;
        try {
            text = FileUtils.readFileToString(file, "UTF-8");
        } catch (IOException e) {
            log.error("Failed to read " + file.getAbsolutePath(),e);
        }

        //log.info("TEXT: " + text);
        log.info("get ngrams");

        NGram ngram = new NGram(text);

        for(int n = 1;n < 6;n++) {
            Map<String, Integer> mapCount = ngram.getTokensCount(n);

            Properties props = new Properties();

            for(Map.Entry<String,Integer> kv : mapCount.entrySet()){
                props.setProperty(kv.getKey(),kv.getValue().toString());
            }

            //props.putAll(mapCount);

            File propsFile = new File(file.getParent() + "/" + file.getName() + "." + n + "gram.properties");

            try {
                Writer writer = new BufferedWriter(new OutputStreamWriter(
                        new FileOutputStream(propsFile), "UTF8"));
                props.store(writer,"");
            } catch (IOException e) {
                log.error("Failed to write " + propsFile.getAbsolutePath(), e);
            }
        }

    }
}
