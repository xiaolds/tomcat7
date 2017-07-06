package com.datasure.catalina.loader;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.apache.catalina.loader.WebappClassLoader;

/**
 * 
 * @ClassName: DecryptClassLoader
 * @Description: 实现自定义解密的 WebClassLoader
 * @date: 2017年7月6日 上午9:35:24
 * @author LiDongSheng
 * @version 0.1
 */
public class DecryptClassLoader extends WebappClassLoader {

	/** 自定义加密文件尾缀 **/
	private static final String CLASS_SUFFIX = ".enclass";
	/** 自定义文件根目录**/
	private static final String DEFAULT_WEB_PATH = "";
	
	/**
	 * 
	 * 通过包名+类名查找Class文件
	 * 
	 * @see org.apache.catalina.loader.WebappClassLoaderBase#findClass(java.lang.String)
	 */
	@Override
	public Class<?> findClass(String name) throws ClassNotFoundException {
		// 1. get file name
		String className = getName(name);
		
		if(className == null ){
			throw new NullPointerException(className + " can't be null.");
		}
		
		try (
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(className));
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				) {

			// read class file and write to Byte
			int c = 0;
			while ((c = in.read()) != -1) {
//				out.write((char) c ^ 2);
				out.write(c);
			}

			byte[] classBytes = out.toByteArray();

			System.out.println("Load customer successful~");
			return defineClass(name, classBytes, 0, classBytes.length);

		} catch (FileNotFoundException fnfe) {
//			throw fnfe;
		} catch (IOException ioe) {
//			throw ioe;
		}
		return super.findClass(name);
	}

	/**
	 * 
	 * getName:(通过全名称获取Class类名称). <br/>
	 *
	 * @author LiDongSheng
	 * @param fullName:
	 * 			com.datasure.lids.Test
	 * @return name
	 * 			com/datasure/lids/Test.enclass || null
	 */
	private String getName(String fullName) {

		if (null == fullName) {
			return null;
		}

		return fullName.replace(".", "/").concat(CLASS_SUFFIX);

	}
}
