package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Mutation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mutation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MutationRepository extends JpaRepository<Mutation, Long> {}
