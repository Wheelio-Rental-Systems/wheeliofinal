package com.wheelio.backend.repository;

import com.wheelio.backend.model.DamageReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DamageReportRepository extends MongoRepository<DamageReport, String> {
    List<DamageReport> findByVehicleId(String vehicleId);

    List<DamageReport> findByReportedById(String reportedById);

    List<DamageReport> findByStatus(DamageReport.DamageStatus status);
}
