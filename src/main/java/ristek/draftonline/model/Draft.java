package ristek.draftonline.model;

import org.hibernate.validator.constraints.Length;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Draft {
    @Id @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Length(min = 1) private String sender;

    @Length(min = 1) private String receiver;

    @Length(min = 1) private String body;

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
