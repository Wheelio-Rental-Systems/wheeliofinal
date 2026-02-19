package com.wheelio.backend.repository;

import com.wheelio.backend.model.DamageReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DamageReportRepository extends JpaRepository<DamageReport, UUID> {
    List<DamageReport> findByVehicleId(UUID vehicleId);

    List<DamageReport> findByStatus(DamageReport.DamageStatus status);

    List<DamageReport> findBySeverity(DamageReport.Severity severity);

    List<DamageReport> findByReportedById(UUID reportedById);
}
