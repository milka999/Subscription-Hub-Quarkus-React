package org.ucg.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.ucg.model.enums.BillingCycle;
import org.ucg.model.enums.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
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

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    private SubscriptionProvider service;

    private LocalDate startedAt;

    private LocalDate dueDate;
}
