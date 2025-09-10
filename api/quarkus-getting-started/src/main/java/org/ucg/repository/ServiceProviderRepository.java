package org.ucg.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.ucg.model.ServiceProvider;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {

    @Query("""
            from ServiceProvider provider
            where :name is null or provider.name is like concat('%', :name, '%')
            """)
    Page<ServiceProvider> findAll(String name, Pageable pageable);
}