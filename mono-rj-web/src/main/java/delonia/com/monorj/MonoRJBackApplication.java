package delonia.com.monorj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class MonoRJBackApplication {

    public static void main(String[] args) {
        File dataDir = new File("./data");
        if (!dataDir.exists()) {
            boolean bMkDir = dataDir.mkdirs();
            if (!bMkDir) {
                System.out.println("Error al crear el directorio de datos");
                System.exit(1);
                
            }
        }        
        SpringApplication.run(MonoRJBackApplication.class, args);
    }

}
