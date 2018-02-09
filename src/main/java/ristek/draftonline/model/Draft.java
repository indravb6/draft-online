package ristek.draftonline.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Draft {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String sender;
    private String receiver;
    private String body;

    public Draft(){}
    public Draft(String sender, String receiver, String body){
        this.sender = sender;
        this.receiver = receiver;
        this.body = body;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public void setSender(String sender){this.sender = sender;}
    public String getSender(){return this.sender;}

    public void setReceiver(String receiver){this.receiver = receiver;}
    public String getReceiver(){return this.receiver;}

    public void setBody(String body){this.body = body;}
    public String getBody(){return this.body;}

}
