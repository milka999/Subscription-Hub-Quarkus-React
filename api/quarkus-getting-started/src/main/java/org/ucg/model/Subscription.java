package org.ucg.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.ucg.model.enums.BillingCycle;
import org.ucg.model.enums.SubscriptionStatus;

@Entity
@Table(name = "subscriptions")
@Data
@EqualsAndHashCode(callSuper = true)
public class Subscription extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle; // e.g., "Monthly", "Yearly"

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status; // e.g., "Active", "Cancelled", "On Hold"

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private SubscriptionService service;

    private LocalDate startedAt;

    private LocalDate dueDate;


}
