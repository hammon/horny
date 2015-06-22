package utils;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Created by michael on 6/22/15.
 */
public class HtmlUnitUtils {
    final static org.slf4j.Logger log = LoggerFactory.getLogger(ProcessUtils.class);
    public static void main(String args[]) {
        WebClient webClient = new WebClient();
        HtmlPage page = null;
        try {
            page = webClient.getPage("https://news.google.com/nwshp?hl=en");
        } catch (IOException e) {
            e.printStackTrace();
        }
        String pageAsText = page.asText();


        System.out.println(pageAsText);
    }
}
