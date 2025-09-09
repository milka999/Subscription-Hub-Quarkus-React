package org.ucg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ucg.model.ServiceProvider;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
}