package ristek.draftonline.repository;

import org.springframework.data.repository.CrudRepository;
import ristek.draftonline.model.Comment;
import ristek.draftonline.model.Draft;
import java.util.List;

public interface CommentRepository extends CrudRepository<Comment, Long>{
    List<Comment> findByDraft(Draft draft);
}
