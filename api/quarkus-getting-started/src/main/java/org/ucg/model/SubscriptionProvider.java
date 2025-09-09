package org.ucg.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "subscription_services")
public class SubscriptionProvider extends BaseEntity {

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String serviceDescription;

    @Column(nullable = false)
    private BigDecimal serviceCost;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private ServiceProvider serviceProvider;
}
