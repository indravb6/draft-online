package ristek.draftonline.repository;

import org.springframework.data.repository.CrudRepository;
import ristek.draftonline.model.Trends;

import java.util.List;

public interface TrendsRepository extends CrudRepository<Trends, Long>{
    Trends findByBodyIgnoreCase(String body);
    List<Trends> findFirst10ByOrderByCntDesc();
}
