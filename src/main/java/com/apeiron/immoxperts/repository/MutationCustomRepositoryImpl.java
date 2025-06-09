package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.repository.MutationCustomRepository;
import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.*;
import org.springframework.stereotype.Repository;

@Repository
public class MutationCustomRepositoryImpl implements MutationCustomRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public CommuneStatsDTO getStatsByCommune(String commune) {
        CommuneStatsDTO stats = new CommuneStatsDTO();
        stats.setCommune(commune.toUpperCase());

        // 1. Get all idadresse for the commune
        List<Integer> adresseIds = em
            .createQuery("SELECT a.id FROM Adresse a WHERE UPPER(a.commune) = UPPER(:commune)", Integer.class)
            .setParameter("commune", commune)
            .getResultList();

        // 2. Collect all mutations from adresse_local and adresse_dispoparc
        Map<Integer, Set<String>> mutationCategories = new HashMap<>();

        // Process adresse_local
        List<Object[]> localResults = em
            .createNativeQuery(
                "SELECT al.idmutation, l.libtyploc " +
                "FROM adresse_local al " +
                "JOIN local l ON al.iddispoloc = l.iddispoloc " +
                "WHERE al.idadresse IN :adresseIds"
            )
            .setParameter("adresseIds", adresseIds)
            .getResultList();

        // Group by mutation and count locals
        Map<Integer, List<String>> mutationTypes = new HashMap<>();
        for (Object[] result : localResults) {
            Integer idMutation = (Integer) result[0];
            String type = ((String) result[1]).toUpperCase();
            mutationTypes.computeIfAbsent(idMutation, k -> new ArrayList<>()).add(type);
        }

        // Process adresse_dispoparc
        List<Integer> dispoparcMutations = em
            .createNativeQuery("SELECT DISTINCT ad.idmutation " + "FROM adresse_dispoparc ad " + "WHERE ad.idadresse IN :adresseIds")
            .setParameter("adresseIds", adresseIds)
            .getResultList();

        // 3. Categorize mutations
        Set<Integer> bienMultiples = new HashSet<>();
        Set<Integer> terrains = new HashSet<>();

        // Check adresse_dispoparc first
        bienMultiples.addAll(dispoparcMutations);

        // Check multiple locals
        for (Map.Entry<Integer, List<String>> entry : mutationTypes.entrySet()) {
            Integer idMutation = entry.getKey();
            List<String> types = entry.getValue();

            if (types.size() > 1) {
                bienMultiples.add(idMutation);
            } else if (!bienMultiples.contains(idMutation)) {
                String mainType = types.get(0);
                switch (mainType) {
                    case "MAISON" -> stats.setMaisons(stats.getMaisons() + 1);
                    case "APPARTEMENT" -> stats.setAppartements(stats.getAppartements() + 1);
                    case "LOCAL COMMERCIAL" -> stats.setLocauxCommerciaux(stats.getLocauxCommerciaux() + 1);
                }
            }
        }

        // 4. Process terrains (disposition_parcelle)
        List<Integer> terrainMutations = em
            .createNativeQuery(
                "SELECT DISTINCT dp.idmutation " +
                "FROM disposition_parcelle dp " +
                "WHERE dp.idmutation IN (" +
                "  SELECT m.idmutation FROM mutation m " +
                "  JOIN adresse a ON m.coddep = a.coddep " +
                "  WHERE UPPER(a.commune) = UPPER(:commune)" +
                ")"
            )
            .setParameter("commune", commune)
            .getResultList();

        for (Integer idMutation : terrainMutations) {
            if (!bienMultiples.contains(idMutation)) {
                terrains.add(idMutation);
            }
        }

        // Set final counts
        stats.setBiensMultiples(bienMultiples.size());
        stats.setTerrains(terrains.size());

        return stats;
    }
}
