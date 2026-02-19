package com.wheelio.backend.controller;

import com.wheelio.backend.model.DamageReport;
import com.wheelio.backend.service.DamageReportService;
import com.wheelio.backend.service.UserService;
import com.wheelio.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/damage-reports")

public class DamageReportController {

    @Autowired
    private DamageReportService damageReportService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<DamageReport> getAllReports() {
        return damageReportService.getAllDamageReports();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DamageReport> getReportById(@PathVariable UUID id) {
        return damageReportService.getDamageReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<DamageReport> getReportsByVehicle(@PathVariable UUID vehicleId) {
        return damageReportService.getDamageReportsByVehicleId(vehicleId);
    }

    @GetMapping("/status/{status}")
    public List<DamageReport> getReportsByStatus(@PathVariable String status) {
        return damageReportService.getDamageReportsByStatus(DamageReport.DamageStatus.valueOf(status.toUpperCase()));
    }

    @GetMapping("/user/{userId}")
    public List<DamageReport> getReportsByUser(@PathVariable UUID userId) {
        return damageReportService.getDamageReportsByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody DamageReportRequest request) {
        try {
            DamageReport report = new DamageReport();
            report.setVehicle(vehicleService.getVehicleById(request.getVehicleId()).orElseThrow());
            report.setReportedBy(userService.getUserById(request.getReportedById()).orElseThrow());
            report.setDescription(request.getDescription());
            report.setImages(request.getImages());
            report.setSeverity(
                    request.getSeverity() != null ? DamageReport.Severity.valueOf(request.getSeverity().toUpperCase())
                            : null);
            report.setStatus(DamageReport.DamageStatus.OPEN);
            if (request.getEstimatedCost() != null) {
                report.setEstimatedCost(request.getEstimatedCost());
                report.setStatus(DamageReport.DamageStatus.ESTIMATED);
            }

            DamageReport savedReport = damageReportService.createDamageReport(report);
            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create damage report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        return damageReportService.getDamageReportById(id)
                .map(report -> {
                    if (request.containsKey("status")) {
                        report.setStatus(DamageReport.DamageStatus.valueOf(request.get("status").toUpperCase()));
                    }
                    if (request.containsKey("severity")) {
                        report.setSeverity(DamageReport.Severity.valueOf(request.get("severity").toUpperCase()));
                    }
                    if (request.containsKey("estimatedCost")) {
                        report.setEstimatedCost(new java.math.BigDecimal(request.get("estimatedCost")));
                    }
                    return ResponseEntity.ok(damageReportService.updateDamageReport(report));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> markReportAsPaid(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        return damageReportService.getDamageReportById(id)
                .map(report -> {
                    report.setStatus(DamageReport.DamageStatus.PAID);
                    if (request.containsKey("razorpayPaymentId")) {
                        report.setRazorpayPaymentId(request.get("razorpayPaymentId"));
                    }
                    DamageReport updated = damageReportService.updateDamageReport(report);
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Payment recorded successfully");
                    response.put("report", updated);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Request DTO
    static class DamageReportRequest {
        private UUID vehicleId;
        private UUID reportedById;
        private String description;
        private List<String> images;
        private String severity;
        private java.math.BigDecimal estimatedCost;

        // Getters and setters
        public UUID getVehicleId() {
            return vehicleId;
        }

        public void setVehicleId(UUID vehicleId) {
            this.vehicleId = vehicleId;
        }

        public UUID getReportedById() {
            return reportedById;
        }

        public void setReportedById(UUID reportedById) {
            this.reportedById = reportedById;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getImages() {
            return images;
        }

        public void setImages(List<String> images) {
            this.images = images;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public java.math.BigDecimal getEstimatedCost() {
            return estimatedCost;
        }

        public void setEstimatedCost(java.math.BigDecimal estimatedCost) {
            this.estimatedCost = estimatedCost;
        }
    }
}
