package org.ucg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.ucg.model.SubscriptionProvider;

import java.util.List;

public interface SubscriptionProviderRepository extends JpaRepository<SubscriptionProvider, Long> {

    @Query("""
            from SubscriptionProvider provider
            where provider.serviceProvider.id = :serviceId
            """)
    List<SubscriptionProvider> findAllByServiceId(Long serviceId);
}
