package ristek.draftonline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.repository.CrudRepository;
import ristek.draftonline.model.Draft;

import java.util.List;

@SpringBootApplication
public class DraftonlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(DraftonlineApplication.class, args);
	}

}
