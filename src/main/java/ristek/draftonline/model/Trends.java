package ristek.draftonline.model;

import org.hibernate.validator.constraints.Length;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Trends {

    @Id
    @Length(min = 1) private String body;

    private Integer cnt;

    public void setBody(String body){
        this.body = body;
    }
    public String getBody(){
        return this.body;
    }

    public void setCnt(Integer cnt){
        this.cnt = cnt;
    }
    public Integer getCnt(){
        return this.cnt;
    }
    public void increaseCnt(){
        this.cnt++;
    }

    public Trends(){}
    public Trends(String body, Integer cnt){
        this.body = body;
        this.cnt = cnt;
    }
}
