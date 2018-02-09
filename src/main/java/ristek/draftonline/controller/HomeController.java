package ristek.draftonline.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import ristek.draftonline.model.Draft;
import ristek.draftonline.repository.DraftRepository;
import java.util.ArrayList;
import java.util.List;


@Controller
@CrossOrigin()
public class HomeController {

    private SimpMessagingTemplate messagingTemplate;
    private DraftRepository draftRepository;
    public HomeController(DraftRepository draftRepository, SimpMessagingTemplate messagingTemplate){
        this.draftRepository = draftRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/draft/add")
    @ResponseBody
    public List<String> addDraft(@RequestParam("from") String sender,
                                @RequestParam("to") String receiver,
                                @RequestParam("message") String body){
        Draft draft = new Draft(sender, receiver, body);
        draftRepository.save(draft);
        messagingTemplate.convertAndSend("/subscribe/draft", draft);
        return new ArrayList<>(); // return empty json
    }

    @GetMapping("/draft/get")
    @ResponseBody
    public List<Draft> getDraft(){
        return draftRepository.findAll();
    }

}
