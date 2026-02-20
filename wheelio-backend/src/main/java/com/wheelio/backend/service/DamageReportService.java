package com.wheelio.backend.service;

import com.wheelio.backend.model.DamageReport;
import java.util.List;
import java.util.Optional;

public interface DamageReportService {
    DamageReport createDamageReport(DamageReport report);

    Optional<DamageReport> getDamageReportById(String id);

    List<DamageReport> getAllDamageReports();

    List<DamageReport> getDamageReportsByVehicleId(String vehicleId);

    List<DamageReport> getDamageReportsByUserId(String userId);

    List<DamageReport> getDamageReportsByStatus(DamageReport.DamageStatus status);

    DamageReport updateDamageReport(DamageReport report);

    void deleteDamageReport(String id);
}
