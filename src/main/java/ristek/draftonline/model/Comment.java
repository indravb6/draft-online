package ristek.draftonline.model;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;

@Entity
public class Comment {
    @Id @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne @JoinColumn(
            name = "draft_id",
            nullable = false,
            updatable = false
    )private Draft draft;

    @Length(min = 1)
    private String body;

    public Comment(){}
    public Comment(Draft draft, String body){
        this.draft = draft;
        this.body = body;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Draft getDraft(){ return draft; }
    public void setDraft(Draft draft){ this.draft = draft; }

    public String getBody(){ return body; }
    public void setBody(String body){ this.body = body; }

}
