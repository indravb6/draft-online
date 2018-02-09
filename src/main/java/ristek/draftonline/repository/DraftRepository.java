package ristek.draftonline.repository;

import org.springframework.data.repository.CrudRepository;
import ristek.draftonline.model.Draft;
import java.util.List;

public interface DraftRepository extends CrudRepository<Draft, Long> {
    List<Draft> findAll();
}
