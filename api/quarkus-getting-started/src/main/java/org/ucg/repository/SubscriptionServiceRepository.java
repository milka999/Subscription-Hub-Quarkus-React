package org.ucg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ucg.model.SubscriptionProvider;

public interface SubscriptionServiceRepository extends JpaRepository<SubscriptionProvider, Long> {
}