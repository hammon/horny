import org.junit.Assert;
import text.NGram;

import java.util.Iterator;
import java.util.Map;

/**
 * Created by malexan on 29/09/2015.
 */
public class NGramTest {
    String testString = "Contrary to the GNU Public License (GPL) the Apache Software License does not make any claims over your extensions. By extensions, we mean totally new code that invokes existing log4j classes. You are free to do whatever you wish with your proprietary log4j extensions. In particular, you may choose to never release your extensions to the wider public.\n" +
            "\n" +
            "We are very careful not to change the log4j client API so that newer log4j releases are backward compatible with previous versions. We are a lot less scrupulous with the internal log4j API. Thus, if your extension is designed to work with log4j version n, then when log4j release version n+1 comes out, you will probably need to adapt your proprietary extensions to the new release. ";

    @org.junit.Test
    public void testOffsets(){
        NGram ngram = new NGram(testString);

        Map<Integer,String> offsets = ngram.getOffsets();

        // offsets.keySet().toArray()

        Iterator<Map.Entry<Integer,String>> it = offsets.entrySet().iterator();

        String rebuilded = "";

        while (it.hasNext()){
            Map.Entry<Integer,String> kv = it.next();

            System.out.println("k: " + kv.getKey() + " v: " + kv.getValue());
            String s = testString.substring(kv.getKey(),kv.getKey() + kv.getValue().length());
            Assert.assertEquals(kv.getValue(),s);
            rebuilded += kv.getValue();
        }

        Assert.assertEquals(testString,rebuilded);
    }
}
