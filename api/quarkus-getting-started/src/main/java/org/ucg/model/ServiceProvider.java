package org.ucg.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_providers")
@Data
public class ServiceProvider extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String contactEmail;
    
    @Column
    private String websiteUrl;

    @Column
    private String cancellationUrl;

    @Column
    private String renewalUrl;
    
}
