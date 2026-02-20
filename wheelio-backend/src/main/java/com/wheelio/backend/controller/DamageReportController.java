package com.wheelio.backend.controller;

import com.wheelio.backend.model.DamageReport;
import com.wheelio.backend.service.DamageReportService;
import com.wheelio.backend.service.UserService;
import com.wheelio.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<DamageReport> getReportById(@PathVariable String id) {
        return damageReportService.getDamageReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<DamageReport> getReportsByVehicle(@PathVariable String vehicleId) {
        return damageReportService.getDamageReportsByVehicleId(vehicleId);
    }

    @GetMapping("/status/{status}")
    public List<DamageReport> getReportsByStatus(@PathVariable String status) {
        return damageReportService.getDamageReportsByStatus(
                DamageReport.DamageStatus.valueOf(status.toUpperCase()));
    }

    @GetMapping("/user/{userId}")
    public List<DamageReport> getReportsByUser(@PathVariable String userId) {
        return damageReportService.getDamageReportsByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody DamageReportRequest request) {
        try {
            var vehicleOpt = vehicleService.getVehicleById(request.getVehicleId());
            var userOpt = userService.getUserById(request.getReportedById());

            if (vehicleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Vehicle not found"));
            }
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            DamageReport report = new DamageReport();
            report.setVehicleId(request.getVehicleId());
            report.setVehicleName(vehicleOpt.get().getName() + " " + vehicleOpt.get().getBrand());
            report.setReportedById(request.getReportedById());
            report.setReportedByName(userOpt.get().getFullName());
            report.setDescription(request.getDescription());
            report.setImages(request.getImages());
            report.setSeverity(request.getSeverity() != null
                    ? DamageReport.Severity.valueOf(request.getSeverity().toUpperCase())
                    : null);
            report.setStatus(DamageReport.DamageStatus.OPEN);
            if (request.getEstimatedCost() != null) {
                report.setEstimatedCost(request.getEstimatedCost());
                report.setStatus(DamageReport.DamageStatus.ESTIMATED);
            }

            return ResponseEntity.ok(damageReportService.createDamageReport(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to create damage report: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(@PathVariable String id, @RequestBody Map<String, Object> request) {
        try {
            return damageReportService.getDamageReportById(id)
                    .map(report -> {
                        if (request.containsKey("status") && request.get("status") != null) {
                            report.setStatus(DamageReport.DamageStatus.valueOf(
                                    ((String) request.get("status")).toUpperCase()));
                        }
                        if (request.containsKey("severity") && request.get("severity") != null) {
                            report.setSeverity(DamageReport.Severity.valueOf(
                                    ((String) request.get("severity")).toUpperCase()));
                        }
                        if (request.containsKey("estimatedCost") && request.get("estimatedCost") != null) {
                            report.setEstimatedCost(new BigDecimal(request.get("estimatedCost").toString()));
                        }
                        return ResponseEntity.ok(damageReportService.updateDamageReport(report));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage(), "type", e.getClass().getName()));
        }
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> markReportAsPaid(@PathVariable String id, @RequestBody Map<String, String> request) {
        return damageReportService.getDamageReportById(id)
                .map(report -> {
                    report.setStatus(DamageReport.DamageStatus.PAID);
                    if (request.containsKey("razorpayPaymentId")) {
                        report.setRazorpayPaymentId(request.get("razorpayPaymentId"));
                    }
                    DamageReport updated = damageReportService.updateDamageReport(report);
                    return ResponseEntity.ok(Map.of("message", "Payment recorded", "report", updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DTO
    static class DamageReportRequest {
        private String vehicleId;
        private String reportedById;
        private String description;
        private List<String> images;
        private String severity;
        private BigDecimal estimatedCost;

        public String getVehicleId() {
            return vehicleId;
        }

        public void setVehicleId(String vehicleId) {
            this.vehicleId = vehicleId;
        }

        public String getReportedById() {
            return reportedById;
        }

        public void setReportedById(String reportedById) {
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

        public BigDecimal getEstimatedCost() {
            return estimatedCost;
        }

        public void setEstimatedCost(BigDecimal estimatedCost) {
            this.estimatedCost = estimatedCost;
        }
    }
}
