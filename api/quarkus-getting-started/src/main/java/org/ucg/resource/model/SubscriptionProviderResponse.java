package org.ucg.resource.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SubscriptionProviderResponse {

    private Long id;
    private String serviceName;
    private String serviceDescription;
    private BigDecimal serviceCost;
    private ServiceProviderResponse serviceProvider;
}
