package org.ucg.resource.model;

import lombok.Data;
import org.ucg.model.enums.BillingCycle;
import org.ucg.model.enums.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubscriptionResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BillingCycle billingCycle; // e.g., "Monthly", "Yearly"
    private SubscriptionStatus status; // e.g., "Active", "Cancelled", "On Hold"
    private SubscriptionProviderResponse provider;
    private LocalDate startedAt;
    private LocalDate dueDate;
}
