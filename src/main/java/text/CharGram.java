package text;

/**
 * Created by michael on 12/02/15.
 */
import java.util.HashMap;
import java.util.Map;

public class CharGram {
    static String txt = "";

    public static Map<String,Integer> getCount(String text, int count){
        txt = text.toLowerCase();
        Map<String,Integer> map = new HashMap<String,Integer>();

        if(count == 1){
            char[] chars = txt.toCharArray();
            for(int i=0; i < chars.length; i++){
                Character ch = chars[i];
                String str = ch.toString();

                if(map.containsKey(str)){
                    map.put(str, map.get(str) + 1);
                }
                else{
                    Integer cc = 1;
                    map.put(str,cc);
                }
            }
        }
        else{
            for(int i=0; i < txt.length(); i++){
                String str = getNext(i,count);
                if(map.containsKey(str)){
                    map.put(str, map.get(str) + 1);
                }
                else{
                    Integer cc = 1;
                    map.put(str,cc);
                }
            }
        }


        return map;
    }

    static String getNext(Integer pos,Integer len){
        String s = "";
        int end = pos + len;
        if(end > txt.length()){
            return s;
        }
        try{
            s = txt.substring(pos, end);
        }
        catch(Exception ex){
            //TODO: something
        }

        return s;
    }
}
