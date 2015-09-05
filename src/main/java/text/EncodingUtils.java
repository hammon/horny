package text;

import java.io.*;
import java.util.Collection;

import org.apache.commons.io.FileUtils;

public class EncodingUtils {

    public static void main(String[] args){
        try {
            EncodingUtils.copyDir(new File("/home/michael/Documents/mashkov/public_html/book"),new File("/home/michael/Documents/mashkovUtf8"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

	public static void changeEncoding(File source, String srcEncoding, File target, String tgtEncoding) throws IOException {
	    BufferedReader br = null;
	    BufferedWriter bw = null;
	    try{
	        br = new BufferedReader(new InputStreamReader(new FileInputStream(source),srcEncoding));
	        bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(target), tgtEncoding));
	        char[] buffer = new char[16384];
	        int read;
	        while ((read = br.read(buffer)) != -1)
	            bw.write(buffer, 0, read);
	    } finally {
	        try {
	            if (br != null)
	                br.close();
	        } finally {
	            if (bw != null)
	                bw.close();
	        }
	    }
	}
	
	public static void koi8rToUtf8(File source){
		File koi8r = new File(source.getAbsoluteFile() + ".koi8r");
		try {
			FileUtils.copyFile(source, koi8r);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		try {
			FileUtils.forceDelete(source);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		try {
			changeEncoding(koi8r, "KOI8-R", source, "UTF-8");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void koi8DirToUtf8(File dir, String fileExtension){
		
		String[] extensions = {fileExtension};
		
		Collection<File> files = FileUtils.listFiles(dir, extensions, true);
		
		for(File f : files){
			koi8rToUtf8(f);
		}
		
	}

	public static void copyDir(File src, File dest)
			throws IOException{

		if(src.isDirectory()){

			//if directory not exists, create it
			if(!dest.exists()){
				dest.mkdir();
				System.out.println("Directory copied from "
						+ src + "  to " + dest);
			}

			//list all the directory contents
			String files[] = src.list();

			for (String file : files) {
				//construct the src and dest file structure
				File srcFile = new File(src, file);
				File destFile = new File(dest, file);
				//recursive copy
                copyDir(srcFile, destFile);
			}

		}else{
			//if file, then copy it
			//Use bytes stream to support all file types
//			InputStream in = new FileInputStream(src);
//			OutputStream out = new FileOutputStream(dest);
//
//			byte[] buffer = new byte[1024];
//
//			int length;
//			//copy the file content in bytes
//			while ((length = in.read(buffer)) > 0){
//				out.write(buffer, 0, length);
//			}
//
//			in.close();
//			out.close();

            System.out.println("Start copy from " + src + " to " + dest);

            try{
                changeEncoding(src, "KOI8-R", dest, "UTF-8");
            }
            catch(Exception e){
                e.printStackTrace();
            }
		}
	}

//    public static void detectEncoding(){
//        CharsetDetector cs=new CharsetDetector();
//        cs.setText(content.getBytes());
//        String sourceEncoding=cs.detect().getName();
//        logger.debug("ENCODING is"+sourceEncoding);
//        if(sourceEncoding.equals("Big5")){
//            logger.debug("ENCO skipping as encoding is Big5 , content is "+content);
//            return content;
//        }
//        String s =null ;
//        try {
//            byte bytes[] = content.getBytes(sourceEncoding);
//            s = new String(bytes, "UTF-8");
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
//    }
}
