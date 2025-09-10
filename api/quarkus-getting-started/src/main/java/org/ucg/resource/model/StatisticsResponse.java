package org.ucg.resource.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsResponse {
    private BigDecimal totalPayments;
    private BigDecimal averageMonthlyPayments;
    private BigDecimal totalForThisMonth;
    private BigDecimal mostExpensiveSubscription;
    private BigDecimal amountOverMonthlyLimit;

}
