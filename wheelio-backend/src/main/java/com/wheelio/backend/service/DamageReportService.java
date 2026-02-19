package com.wheelio.backend.service;

import com.wheelio.backend.model.DamageReport;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DamageReportService {
    DamageReport createDamageReport(DamageReport damageReport);

    Optional<DamageReport> getDamageReportById(UUID id);

    List<DamageReport> getAllDamageReports();

    List<DamageReport> getDamageReportsByVehicleId(UUID vehicleId);

    List<DamageReport> getDamageReportsByStatus(DamageReport.DamageStatus status);

    List<DamageReport> getDamageReportsBySeverity(DamageReport.Severity severity);

    List<DamageReport> getDamageReportsByUserId(UUID userId);

    DamageReport updateDamageReport(DamageReport damageReport);

    void deleteDamageReport(UUID id);
}
