package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.DamageReport;
import com.wheelio.backend.repository.DamageReportRepository;
import com.wheelio.backend.service.DamageReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DamageReportServiceImpl implements DamageReportService {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @Override
    public DamageReport createDamageReport(DamageReport report) {
        return damageReportRepository.save(report);
    }

    @Override
    public Optional<DamageReport> getDamageReportById(String id) {
        return damageReportRepository.findById(id);
    }

    @Override
    public List<DamageReport> getAllDamageReports() {
        return damageReportRepository.findAll();
    }

    @Override
    public List<DamageReport> getDamageReportsByVehicleId(String vehicleId) {
        return damageReportRepository.findByVehicleId(vehicleId);
    }

    @Override
    public List<DamageReport> getDamageReportsByUserId(String userId) {
        return damageReportRepository.findByReportedById(userId);
    }

    @Override
    public List<DamageReport> getDamageReportsByStatus(DamageReport.DamageStatus status) {
        return damageReportRepository.findByStatus(status);
    }

    @Override
    public DamageReport updateDamageReport(DamageReport report) {
        return damageReportRepository.save(report);
    }

    @Override
    public void deleteDamageReport(String id) {
        damageReportRepository.deleteById(id);
    }
}
