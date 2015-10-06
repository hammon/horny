package utils;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

public class HttpUtils {

    private static final Logger log = Logger.getLogger(HttpUtils.class.getName());

    public static void main(String[] args){
        HttpUtils http = new HttpUtils();

        String accessToken = "";

        String txt = "";

        String res = http.get("https://graph.facebook.com/v2.4/716169611845582?fields=feed.limit(100){id,message,name}&access_token=" + accessToken);

        JSONObject obj = new JSONObject(res);

        JSONArray arr = obj.getJSONObject("feed").getJSONArray("data");

        for(int i = 0;i < arr.length();i++){
            System.out.println("i: " + i);
            txt += arr.getJSONObject(i).getString("message");
            txt += "\n";
        }

        System.out.println("txt: " + txt);

        try {
            FileUtils.writeStringToFile(new java.io.File("c:\\vasilisa.txt"),txt,"UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

	public String get(String url){

        log.info("HttpUtils.get url: " + url);
		URLConnection connection = null;
		try {
			connection = new URL(url).openConnection();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		connection.setRequestProperty("Accept-Charset", "UTF-8");
		
		InputStream response = null;
		
		try {
			response = connection.getInputStream();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		InputStreamReader is = new InputStreamReader(response);
		StringBuilder sb=new StringBuilder();
		BufferedReader br = new BufferedReader(is);
		String read = null;
		try {
			read = br.readLine();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		while(read != null) {
		    //log.info(ln(read);
		    sb.append(read);
		    try {
				read =br.readLine();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		
		return sb.toString();
		
	}

    public String post(String url,String headers, String body){
        Map<String,String> mapHeader = new HashMap<>();

        return null;
    }

    public String post(String url,Map<String,String> headers, String body){
        System.out.println("post url: " + url + " body: " + body);

        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(url).openConnection();
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        connection.setDoOutput(true);
        connection.setDoInput(true);
        connection.setInstanceFollowRedirects(false);
        try {
            connection.setRequestMethod("POST");
        } catch (ProtocolException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }


        for(String key: headers.keySet()){
            connection.setRequestProperty(key,headers.get(key));
        }

        connection.setRequestProperty("Content-Length", "" + String.valueOf(body.length()));
        connection.setUseCaches (false);

        DataOutputStream wr;
        try {
            wr = new DataOutputStream(connection.getOutputStream ());
            wr.write(body.getBytes("UTF-8"));
            //wr.writeUTF(body);
            wr.flush();
            wr.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        String result = "";
        InputStream response = null;

        try {
            if(connection.getResponseCode() == -1){
                BufferedReader reader = null;
                response =  connection.getErrorStream();
                reader = new BufferedReader(new InputStreamReader(response, "UTF-8"));
                for (String line; (line = reader.readLine()) != null;) {
                    result += line;
                }
                return result;
            }
        } catch (IOException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }


        try {
            response = connection.getInputStream();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            try {
                //Integer code = connection.getResponseCode();
                //result = code.toString() + " " + connection.getResponseMessage();

                //connection.getErrorStream();
                BufferedReader reader = null;
                response =  connection.getErrorStream();
                reader = new BufferedReader(new InputStreamReader(response, "UTF-8"));
                for (String line; (line = reader.readLine()) != null;) {
                    result += line;
                }
                response.close();

                return result;
            } catch (IOException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            }
        }

        String contentType = connection.getHeaderField("Content-Type");
        String charset = null;
        if(contentType != null){
            for (String param : contentType.replace(" ", "").split(";")) {
                if (param.startsWith("charset=")) {
                    charset = param.split("=", 2)[1];
                    break;
                }
            }
        }

        if (charset != null) {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new InputStreamReader(response, charset));
                for (String line; (line = reader.readLine()) != null;) {
                    result += line;
                }
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } finally {
                if (reader != null) try { reader.close(); } catch (IOException e) {}
            }
        } else {
            // It's likely binary content, use InputStream/OutputStream.
        }

        return result;
    }
	
	public String post(String url,String body){

        Map<String,String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Accept", "application/json");
        headers.put("charset", "UTF-8");

        return  post(url,headers,body);

	}

    public String delete(String url){
        String res = "";

        //URL url = new URL(url);
        HttpURLConnection httpCon = null;
        try {
            httpCon = (HttpURLConnection) (new URL(url)).openConnection();
        } catch (IOException e) {
            e.printStackTrace();
        }
        httpCon.setDoOutput(true);
        httpCon.setRequestProperty(
                "Content-Type", "application/x-www-form-urlencoded" );
        try {
            httpCon.setRequestMethod("DELETE");
            System.out.println(httpCon.getResponseCode());
        } catch (ProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            httpCon.connect();
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            if (httpCon != null) {
                httpCon.disconnect();
            }
        }

        return res;
    }
}
