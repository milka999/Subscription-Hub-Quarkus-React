package org.ucg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ucg.model.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
}