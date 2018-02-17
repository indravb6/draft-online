package ristek.draftonline.repository;

import org.springframework.data.repository.CrudRepository;
import ristek.draftonline.model.Draft;
import java.util.List;

public interface DraftRepository extends CrudRepository<Draft, Long> {
    Draft findById(Long id);
    List<Draft> findFirst10ByOrderByIdDesc();
    List<Draft> findFirst10ByIdLessThanOrderByIdDesc(Long after);
    List<Draft> findAll();
    List<Draft> findByBodyIgnoreCaseContainingOrderByIdDesc(String key);
}
