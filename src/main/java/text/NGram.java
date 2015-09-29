package text;

import java.util.*;

public class NGram {

    List<Character> separators = null;
    String txt = "";
    Map<String,List<Integer>> tokenPosNoSeps = new HashMap<String, List<Integer>>();
    Map<Integer,String> lowerTokensNoSeps = new HashMap<Integer, String>();
    Map<Integer,String> offsets = new TreeMap<Integer,String>();

    public NGram(String text){
        txt = text;
        separators = new ArrayList<Character>(Arrays.asList(' ','.',',',':',';','`','\'',' ','\\','/','?','@','$','#','<','>','|','"','\n','\r','\t','=','(',')','{','}','[',']','!','-'));
        tokenize();
    }

    boolean isSeparator(Character ch){
        return separators.contains(ch);
    }

    void addTokenPos(String token,int pos){
        try{
            if(tokenPosNoSeps.containsKey(token)){
                tokenPosNoSeps.get(token).add(pos);
            }
            else{
                List<Integer> list = new ArrayList<Integer>();
                list.add(pos);
                tokenPosNoSeps.put(token,list);
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
    }

    void tokenize(){
        try{
            int pos = 0;
            String word = "";
            for(int i = 0;i < txt.length();i++){
                Character ch =  txt.charAt(i);//text[i];
                if(!this.isSeparator(ch)){
                    word += ch;
                }
                else{
                    if(word.length() > 0){

                        addTokenPos(word.toLowerCase(), pos);
                        lowerTokensNoSeps.put(pos,word.toLowerCase());
                        pos +=1;

                        offsets.put(i - word.length(),word);
                        offsets.put(i,ch.toString());

                        //this.tokens.push(word);
                        //this.tokens.push(ch);

                        //this.lowerTokens.push(word.toLowerCase());
                        //this.lowerTokens.push(ch.toLowerCase());
                        word = "";
                    }
                    else{
                        offsets.put(i,ch.toString());
                    }
                }
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
    }

    String getNextNgram(Integer pos, Integer len){
        String tag = "";
        Integer lim = pos + len;
        if(lim > lowerTokensNoSeps.size()){
            return tag;
        }

        for(int i = pos;i < lim; i++){
            tag += lowerTokensNoSeps.get(i) + " ";
        }
        return tag.trim();
    }

    public Map<String,Integer> getTokensCount(Integer ngramLen){

        Map<String,Integer> ngramCount = new HashMap<String, Integer>();

        Set<String> keys = tokenPosNoSeps.keySet();

        if(ngramLen == 1){
            for(String k : keys){
                ngramCount.put(k, tokenPosNoSeps.get(k).size());
            }
        }
        else{
            for(int i = 0;i < lowerTokensNoSeps.size() ;i++){
                String ngram = getNextNgram(i,ngramLen);
                if(ngramCount.containsKey(ngram)){
                    ngramCount.put(ngram, ngramCount.get(ngram) + 1);
                }
                else{
                    ngramCount.put(ngram,1);
                }
            }
        }


        return ngramCount;
    }

    public Map<Integer,String> getOffsets(){
        return offsets;
    }

}
