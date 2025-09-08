package org.ucg.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.ucg.model.BaseEntity;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "subscription_services")
public class SubscriptionService extends BaseEntity {

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
