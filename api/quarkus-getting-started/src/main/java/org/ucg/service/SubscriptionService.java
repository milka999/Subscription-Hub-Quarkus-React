package org.ucg.service;

import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.ucg.resource.model.StatisticsResponse;

import java.math.BigDecimal;

@Dependent
@RequiredArgsConstructor
public class SubscriptionService {

    @Inject
    EntityManager entityManager;

    public StatisticsResponse getUserStatistics(Long userId) {
        String sql = """
            SELECT 
                COALESCE(SUM(s.price), 0) as total_payments,
                COALESCE(AVG(CASE 
                    WHEN s.billing_cycle = 'MONTHLY' THEN s.price
                    WHEN s.billing_cycle = 'YEARLY' THEN s.price / 12
                    ELSE s.price
                END), 0) as average_monthly_payments,
                COALESCE(SUM(CASE 
                    WHEN s.billing_cycle = 'MONTHLY' 
                         AND s.status = 'ACTIVE' 
                         AND EXTRACT(YEAR FROM s.due_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                         AND EXTRACT(MONTH FROM s.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                    THEN s.price
                    WHEN s.billing_cycle = 'YEARLY'
                         AND s.status = 'ACTIVE'
                         AND EXTRACT(YEAR FROM s.due_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                         AND EXTRACT(MONTH FROM s.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                    THEN s.price / 12
                    ELSE 0
                END), 0) as total_for_this_month,
                COALESCE(MAX(CASE 
                    WHEN s.billing_cycle = 'MONTHLY' THEN s.price
                    WHEN s.billing_cycle = 'YEARLY' THEN s.price / 12
                    ELSE s.price
                END), 0) as most_expensive_subscription,
                COALESCE((
                    SELECT 
                        CASE 
                            WHEN monthly_total > u.monthly_limit THEN monthly_total - u.monthly_limit
                            ELSE 0
                        END
                    FROM (
                        SELECT SUM(CASE 
                            WHEN s2.billing_cycle = 'MONTHLY' 
                                 AND s2.status = 'ACTIVE' 
                                 AND EXTRACT(YEAR FROM s2.due_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                                 AND EXTRACT(MONTH FROM s2.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                            THEN s2.price
                            WHEN s2.billing_cycle = 'YEARLY'
                                 AND s2.status = 'ACTIVE'
                                 AND EXTRACT(YEAR FROM s2.due_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                                 AND EXTRACT(MONTH FROM s2.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                            THEN s2.price / 12
                            ELSE 0
                        END) as monthly_total
                        FROM subscriptions s2
                        WHERE s2.user_id = :userId
                    ) mt
                ), 0) as amount_over_monthly_limit
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.user_id
            WHERE u.id = :userId
            GROUP BY u.id, u.monthly_limit
            """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("userId", userId);

        Object[] result = (Object[]) query.getSingleResult();

        return new StatisticsResponse(
                convertToBigDecimal(result[0]),
                convertToBigDecimal(result[1]),
                convertToBigDecimal(result[2]),
                convertToBigDecimal(result[3]),
                convertToBigDecimal(result[4])
        );
    }

    public StatisticsResponse getAllUsersStatistics() {
        String sql = """
            WITH monthly_totals AS (
                SELECT 
                    u.id as user_id,
                    u.monthly_limit,
                    SUM(CASE 
                        WHEN s.billing_cycle = 'MONTHLY' 
                             AND s.status = 'ACTIVE' 
                             AND EXTRACT(YEAR FROM s.due_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                             AND EXTRACT(MONTH FROM s.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                        THEN s.price
                        WHEN s.billing_cycle = 'YEARLY'
                             AND s.status = 'ACTIVE'
                             AND EXTRACT(YEAR FROM s.due_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                             AND EXTRACT(MONTH FROM s.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                        THEN s.price / 12
                        ELSE 0
                    END) as monthly_total
                FROM users u
                LEFT JOIN subscriptions s ON u.id = s.user_id
                GROUP BY u.id, u.monthly_limit
            )
            SELECT 
                COALESCE(SUM(s.price), 0) as total_payments,
                COALESCE(AVG(CASE 
                    WHEN s.billing_cycle = 'MONTHLY' THEN s.price
                    WHEN s.billing_cycle = 'YEARLY' THEN s.price / 12
                    ELSE s.price
                END), 0) as average_monthly_payments,
                COALESCE((SELECT SUM(monthly_total) FROM monthly_totals), 0) as total_for_this_month,
                COALESCE(MAX(CASE 
                    WHEN s.billing_cycle = 'MONTHLY' THEN s.price
                    WHEN s.billing_cycle = 'YEARLY' THEN s.price / 12
                    ELSE s.price
                END), 0) as most_expensive_subscription,
                COALESCE(SUM(CASE 
                    WHEN mt.monthly_total > mt.monthly_limit 
                    THEN mt.monthly_total - mt.monthly_limit
                    ELSE 0
                END), 0) as amount_over_monthly_limit
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.user_id
            LEFT JOIN monthly_totals mt ON u.id = mt.user_id
            """;

        Query query = entityManager.createNativeQuery(sql);
        Object[] result = (Object[]) query.getSingleResult();

        return new StatisticsResponse(
                convertToBigDecimal(result[0]),
                convertToBigDecimal(result[1]),
                convertToBigDecimal(result[2]),
                convertToBigDecimal(result[3]),
                convertToBigDecimal(result[4])
        );
    }

    private BigDecimal convertToBigDecimal(Object value) {
        return switch (value) {
            case BigDecimal bigDecimal -> bigDecimal;
            case Number number -> BigDecimal.valueOf(number.doubleValue());
            case null, default -> BigDecimal.ZERO;
        };
    }

}
