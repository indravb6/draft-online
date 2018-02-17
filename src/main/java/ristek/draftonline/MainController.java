package ristek.draftonline;

import io.reactivex.Observable;
import io.reactivex.schedulers.Schedulers;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import ristek.draftonline.model.Comment;
import ristek.draftonline.model.Draft;
import ristek.draftonline.model.Trends;
import ristek.draftonline.repository.CommentRepository;
import ristek.draftonline.repository.DraftRepository;
import ristek.draftonline.repository.TrendsRepository;
import java.util.List;

@Controller
public class MainController {

    private SimpMessagingTemplate messagingTemplate;
    private DraftRepository draftRepository;
    private CommentRepository commentRepository;
    private TrendsRepository trendsRepository;
    public MainController(DraftRepository draftRepository,
                          SimpMessagingTemplate messagingTemplate,
                          CommentRepository commentRepository,
                          TrendsRepository trendsRepository){
        this.draftRepository = draftRepository;
        this.messagingTemplate = messagingTemplate;
        this.commentRepository = commentRepository;
        this.trendsRepository = trendsRepository;
    }

    @PostMapping("/draft/add")
    @ResponseBody
    public Long addDraft(@RequestParam("from") String sender,
                         @RequestParam("to") String receiver,
                         @RequestParam("message") String body){
        Draft draft = new Draft(sender, receiver, body);
        draftRepository.save(draft);
        messagingTemplate.convertAndSend("/subscribe/draft", draft);
        addTrends(body);
        return draft.getId();
    }

    @GetMapping("/draft/get/latest")
    @ResponseBody
    public List<Draft> getLatestDraft(){
        return draftRepository.findFirst10ByOrderByIdDesc();
    }

    @GetMapping("/draft/get/search")
    @ResponseBody
    public List<Draft> getSearchDraft(@RequestParam("key") String key){
        return draftRepository.findByBodyIgnoreCaseContainingOrderByIdDesc(key);
    }

    @GetMapping("/draft/get/next")
    @ResponseBody
    public List<Draft> getNextDraft(@RequestParam("after") Long after){
        return draftRepository.findFirst10ByIdLessThanOrderByIdDesc(after);
    }

    @GetMapping("/draft/get/id")
    @ResponseBody
    public Draft getDraftById(@RequestParam("id") Long id){
        return draftRepository.findById(id);
    }

    @PostMapping("/comment/add")
    @ResponseBody
    public Long addComment(@RequestParam("id") Long id,
                           @RequestParam("body") String body){
        Comment comment = new Comment(draftRepository.findById(id), body);
        commentRepository.save(comment);
        messagingTemplate.convertAndSend("/subscribe/comment", comment);
        return comment.getId();
    }

    @GetMapping("/comment/get")
    @ResponseBody
    public List<Comment> getComment(@RequestParam("id") Long id){
        return commentRepository.findByDraft(draftRepository.findById(id));
    }


    private void addTrends(String body){
        Observable<String> observable = Observable.fromArray(body.split(" ")).observeOn(Schedulers.newThread());
        observable.subscribe(s -> {
            if(!(s.length() <= 1 || s.charAt(0) != '#' || StringUtils.countOccurrencesOf(s, "#") > 1))
                addTrend(s);
        });
    }

    private void addTrend(String word){
        Trends trends = trendsRepository.findByBody(word);
        if(trends == null)
            trendsRepository.save(new Trends(word, 1));
        else{
            trends.increaseCnt();
            trendsRepository.save(trends);
        }
    }

    @GetMapping("/trends/get")
    @ResponseBody
    public List<Trends> getTrends(){
        return trendsRepository.findFirst10ByOrderByCntDesc();
    }
}
