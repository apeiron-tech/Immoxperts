package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DvfAchatDetailView;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DvfAchatDetailViewRepository extends JpaRepository<DvfAchatDetailView, Long> {

    List<DvfAchatDetailView> findByPublicationIdIn(List<Long> publicationIds);
}
