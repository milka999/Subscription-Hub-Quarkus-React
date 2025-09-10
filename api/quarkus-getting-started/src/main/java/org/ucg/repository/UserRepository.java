package org.ucg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.ucg.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}