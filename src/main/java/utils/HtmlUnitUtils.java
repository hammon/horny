package utils;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

/**
 * Created by michael on 6/22/15.
 */
public class HtmlUnitUtils {
    final static org.slf4j.Logger log = LoggerFactory.getLogger(ProcessUtils.class);
    public static void main(String args[]) {
//        WebClient webClient = new WebClient();
//        HtmlPage page = null;
//        try {
//            page = webClient.getPage("https://news.google.com/nwshp?hl=en");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        String pageAsText = page.asText();

        HtmlUnitUtils html = new HtmlUnitUtils();

        String res = html.getPageDetails("https://news.google.com/nwshp?hl=en");


        System.out.println(res);
    }

    public String getPageDetails(String url){
        JSONObject objRes = new JSONObject();

        WebClient webClient = new WebClient();
        HtmlPage page = null;
        try {
            page = webClient.getPage(url);
        } catch (IOException e) {
            log.error("Error getting page",e);
        }

        String title = page.getTitleText();
        objRes.put("title",title);

        String text = page.asText();
        objRes.put("text",text);

        JSONArray arrLinks = new JSONArray();
        List anchors = page.getAnchors();
        for (Iterator iter = anchors.iterator(); iter.hasNext();) {
            HtmlAnchor anchor = (HtmlAnchor) iter.next();

            JSONObject objLink = new JSONObject();
            objLink.put("text",anchor.getTextContent());
            objLink.put("url",anchor.getHrefAttribute());

            arrLinks.put(objLink);

            //System.out.println(anchor.getHrefAttribute());

        }

        objRes.put("links",arrLinks);

        return objRes.toString(4);
    }
}
