package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DvfLouerDetailView;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DvfLouerDetailViewRepository extends JpaRepository<DvfLouerDetailView, Long> {

    List<DvfLouerDetailView> findByPublicationIdIn(List<Long> publicationIds);
}
