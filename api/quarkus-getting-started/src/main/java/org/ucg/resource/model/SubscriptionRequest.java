package org.ucg.resource.model;

import lombok.Getter;
import lombok.Setter;
import org.ucg.model.enums.BillingCycle;
import org.ucg.model.enums.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SubscriptionRequest {

    private Long id;

    private String name;
    private String description;
    private BigDecimal price;
    private BillingCycle billingCycle; // e.g., "Monthly", "Yearly"
    private SubscriptionStatus status; // e.g., "Active", "Cancelled", "On Hold"

    private Long providerId;

    private LocalDate startedAt;

    private LocalDate dueDate;
}
