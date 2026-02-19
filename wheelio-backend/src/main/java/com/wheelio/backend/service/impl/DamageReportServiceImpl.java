package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.DamageReport;
import com.wheelio.backend.repository.DamageReportRepository;
import com.wheelio.backend.service.DamageReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DamageReportServiceImpl implements DamageReportService {

    private final DamageReportRepository damageReportRepository;

    @Autowired
    public DamageReportServiceImpl(DamageReportRepository damageReportRepository) {
        this.damageReportRepository = damageReportRepository;
    }

    @Override
    public DamageReport createDamageReport(DamageReport damageReport) {
        damageReport.setCreatedAt(LocalDateTime.now());
        return damageReportRepository.save(damageReport);
    }

    @Override
    public Optional<DamageReport> getDamageReportById(UUID id) {
        return damageReportRepository.findById(id);
    }

    @Override
    public List<DamageReport> getAllDamageReports() {
        return damageReportRepository.findAll();
    }

    @Override
    public List<DamageReport> getDamageReportsByVehicleId(UUID vehicleId) {
        return damageReportRepository.findByVehicleId(vehicleId);
    }

    @Override
    public List<DamageReport> getDamageReportsByStatus(DamageReport.DamageStatus status) {
        return damageReportRepository.findByStatus(status);
    }

    @Override
    public List<DamageReport> getDamageReportsBySeverity(DamageReport.Severity severity) {
        return damageReportRepository.findBySeverity(severity);
    }

    @Override
    public List<DamageReport> getDamageReportsByUserId(UUID userId) {
        return damageReportRepository.findByReportedById(userId);
    }

    @Override
    public DamageReport updateDamageReport(DamageReport damageReport) {
        return damageReportRepository.save(damageReport);
    }

    @Override
    public void deleteDamageReport(UUID id) {
        damageReportRepository.deleteById(id);
    }
}
