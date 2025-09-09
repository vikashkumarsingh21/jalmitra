// Jalmitra Live Data Dashboard JavaScript
// Real-time sensor data simulation and dashboard functionality

class JalmitraDashboard {
    constructor() {
        this.isPaused = false;
        this.updateInterval = null;
        this.sensorData = {
            temperature: { value: 27, min: 20, max: 35, unit: '°C' },
            humidity: { value: 62, min: 30, max: 90, unit: '%' },
            ph: { value: 7.1, min: 6.0, max: 8.0, unit: 'pH' },
            turbidity: { value: 24, min: 0, max: 100, unit: 'NTU' },
            battery: { value: 77, min: 0, max: 100, unit: '%' },
            gasLevel: { value: 0, min: 0, max: 1000, unit: 'ppm' }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startDataUpdates();
        this.updateLastUpdateTime();
        this.animateCounters();
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('pause-btn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('refresh-btn')?.addEventListener('click', () => this.refreshData());
        document.getElementById('export-btn')?.addEventListener('click', () => this.exportData());

        // GPS controls
        document.querySelector('.gps-controls .control-btn:first-child')?.addEventListener('click', () => this.centerMap());
        document.querySelector('.gps-controls .control-btn:last-child')?.addEventListener('click', () => this.toggleFullscreen());
    }

    startDataUpdates() {
        this.updateInterval = setInterval(() => {
            if (!this.isPaused) {
                this.updateSensorData();
                this.updateDashboard();
                this.updateLastUpdateTime();
            }
        }, 5000); // Update every 5 seconds
    }

    updateSensorData() {
        // Simulate realistic sensor data changes
        this.sensorData.temperature.value = this.simulateValue(this.sensorData.temperature.value, 0.5, 20, 35);
        this.sensorData.humidity.value = this.simulateValue(this.sensorData.humidity.value, 2, 30, 90);
        this.sensorData.ph.value = this.simulateValue(this.sensorData.ph.value, 0.1, 6.0, 8.0);
        this.sensorData.turbidity.value = this.simulateValue(this.sensorData.turbidity.value, 3, 0, 100);
        this.sensorData.battery.value = Math.max(0, this.sensorData.battery.value - 0.1); // Gradual battery drain
        this.sensorData.gasLevel.value = this.simulateValue(this.sensorData.gasLevel.value, 0.2, 0, 10);
    }

    simulateValue(current, variance, min, max) {
        const change = (Math.random() - 0.5) * variance;
        const newValue = current + change;
        return Math.max(min, Math.min(max, newValue));
    }

    updateDashboard() {
        // Update temperature
        const tempValue = document.getElementById('temperature-value');
        if (tempValue) {
            tempValue.textContent = this.sensorData.temperature.value.toFixed(1);
            this.updateSensorStatus('temperature', this.sensorData.temperature.value, 20, 30);
        }

        // Update humidity
        const humidityValue = document.getElementById('humidity-value');
        const humidityProgress = document.getElementById('humidity-progress');
        if (humidityValue && humidityProgress) {
            const humidity = Math.round(this.sensorData.humidity.value);
            humidityValue.textContent = humidity;
            humidityProgress.style.width = `${humidity}%`;
            this.updateSensorStatus('humidity', humidity, 40, 70);
        }

        // Update pH
        const phValue = document.getElementById('ph-value');
        if (phValue) {
            const ph = this.sensorData.ph.value.toFixed(1);
            phValue.textContent = ph;
            this.updatePhIndicator(ph);
            this.updateSensorStatus('ph', parseFloat(ph), 6.5, 7.5);
        }

        // Update turbidity
        const turbidityValue = document.getElementById('turbidity-value');
        if (turbidityValue) {
            const turbidity = Math.round(this.sensorData.turbidity.value);
            turbidityValue.textContent = turbidity;
            this.updateWaterClarity(turbidity);
            this.updateSensorStatus('turbidity', turbidity, 0, 10);
        }

        // Update battery
        const batteryValue = document.getElementById('battery-value');
        const batteryFill = document.getElementById('battery-fill');
        if (batteryValue && batteryFill) {
            const battery = Math.round(this.sensorData.battery.value);
            batteryValue.textContent = battery;
            batteryFill.style.width = `${battery}%`;
            this.updateSensorStatus('battery', battery, 20, 100);
        }

        // Update gas detection
        const gasValue = document.getElementById('gas-value');
        const gasIndicator = document.getElementById('gas-status-indicator');
        if (gasValue && gasIndicator) {
            const gasLevel = this.sensorData.gasLevel.value;
            if (gasLevel < 1) {
                gasValue.textContent = 'No Leak';
                gasIndicator.className = 'gas-status safe';
            } else if (gasLevel < 5) {
                gasValue.textContent = 'Low Level';
                gasIndicator.className = 'gas-status warning';
            } else {
                gasValue.textContent = 'High Level';
                gasIndicator.className = 'gas-status danger';
            }
        }

        // Update Water Quality Index
        this.updateWQI();
    }

    updateSensorStatus(sensorType, value, minGood, maxGood) {
        const statusElement = document.querySelector(`.${sensorType}-sensor .sensor-status`);
        if (!statusElement) return;

        let status, className;
        if (value >= minGood && value <= maxGood) {
            status = sensorType === 'ph' ? 'Neutral' : 'Normal';
            className = 'status-normal';
        } else if (value < minGood - (maxGood - minGood) * 0.5 || value > maxGood + (maxGood - minGood) * 0.5) {
            status = 'Critical';
            className = 'status-critical';
        } else {
            status = 'Warning';
            className = 'status-warning';
        }

        statusElement.textContent = status;
        statusElement.className = `sensor-status ${className}`;
    }

    updatePhIndicator(ph) {
        const indicator = document.querySelector('.ph-indicator');
        if (indicator) {
            const percentage = ((ph - 6.0) / (8.0 - 6.0)) * 100;
            indicator.style.left = `${Math.max(0, Math.min(100, percentage))}%`;
        }
    }

    updateWaterClarity(turbidity) {
        const clarity = document.getElementById('water-clarity');
        if (clarity) {
            const opacity = Math.min(1, turbidity / 50);
            clarity.style.backgroundColor = `rgba(139, 69, 19, ${opacity})`;
        }
    }

    updateWQI() {
        const wqiValue = document.querySelector('.wqi-value');
        const wqiLabel = document.querySelector('.wqi-label');
        
        if (wqiValue && wqiLabel) {
            // Calculate WQI based on sensor values
            const temp = this.sensorData.temperature.value;
            const ph = this.sensorData.ph.value;
            const turbidity = this.sensorData.turbidity.value;
            
            let wqi = 100;
            
            // Deduct points for out-of-range values
            if (temp < 20 || temp > 30) wqi -= 10;
            if (ph < 6.5 || ph > 7.5) wqi -= 15;
            if (turbidity > 10) wqi -= Math.min(30, turbidity - 10);
            
            wqi = Math.max(0, Math.round(wqi));
            wqiValue.textContent = wqi;
            
            let label, color;
            if (wqi >= 80) {
                label = 'Excellent';
                color = '#4CAF50';
            } else if (wqi >= 60) {
                label = 'Good';
                color = '#8BC34A';
            } else if (wqi >= 40) {
                label = 'Fair';
                color = '#FFC107';
            } else {
                label = 'Poor';
                color = '#f44336';
            }
            
            wqiLabel.textContent = label;
            wqiValue.style.color = color;
        }
    }

    updateLastUpdateTime() {
        const timeElement = document.getElementById('last-update-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour12: false });
            timeElement.textContent = timeString;
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            if (this.isPaused) {
                pauseBtn.innerHTML = '<i class="bi bi-play"></i> Resume Updates';
                pauseBtn.classList.add('paused');
            } else {
                pauseBtn.innerHTML = '<i class="bi bi-pause"></i> Pause Updates';
                pauseBtn.classList.remove('paused');
            }
        }
    }

    refreshData() {
        this.updateSensorData();
        this.updateDashboard();
        this.updateLastUpdateTime();
        
        // Visual feedback
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.classList.add('refreshing');
            setTimeout(() => {
                refreshBtn.classList.remove('refreshing');
            }, 1000);
        }
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            sensors: this.sensorData,
            location: {
                latitude: 22.3072,
                longitude: 70.8022,
                address: "Rajkot, Gujarat, India"
            }
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `jalmitra_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    centerMap() {
        // Simulate map centering
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            mapPlaceholder.style.transform = 'scale(0.95)';
            setTimeout(() => {
                mapPlaceholder.style.transform = 'scale(1)';
            }, 200);
        }
    }

    toggleFullscreen() {
        const gpsContainer = document.querySelector('.gps-container');
        if (gpsContainer) {
            if (gpsContainer.classList.contains('fullscreen')) {
                gpsContainer.classList.remove('fullscreen');
                document.exitFullscreen?.();
            } else {
                gpsContainer.classList.add('fullscreen');
                gpsContainer.requestFullscreen?.();
            }
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.metric-value');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                }
            }, 20);
        });
    }

    // GPS simulation functions
    simulateGPSMovement() {
        const coords = document.querySelectorAll('.coordinates span');
        if (coords.length >= 2) {
            const latChange = (Math.random() - 0.5) * 0.0001;
            const lonChange = (Math.random() - 0.5) * 0.0001;
            
            let currentLat = parseFloat(coords[0].textContent.match(/[\d.]+/)[0]);
            let currentLon = parseFloat(coords[1].textContent.match(/[\d.]+/)[0]);
            
            currentLat += latChange;
            currentLon += lonChange;
            
            coords[0].textContent = `Lat: ${currentLat.toFixed(4)}° N`;
            coords[1].textContent = `Long: ${currentLon.toFixed(4)}° E`;
        }
    }

    // Alert system
    checkAlerts() {
        const alerts = [];
        
        if (this.sensorData.temperature.value > 32) {
            alerts.push('High temperature detected');
        }
        if (this.sensorData.ph.value < 6.5 || this.sensorData.ph.value > 7.5) {
            alerts.push('pH level outside safe range');
        }
        if (this.sensorData.turbidity.value > 50) {
            alerts.push('High turbidity detected');
        }
        if (this.sensorData.battery.value < 20) {
            alerts.push('Low battery warning');
        }
        
        // Update alerts counter
        const alertsMetric = document.querySelectorAll('.metric-value')[2];
        if (alertsMetric) {
            alertsMetric.textContent = alerts.length;
        }
        
        return alerts;
    }

    // Cleanup method
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jalmitraDashboard = new JalmitraDashboard();
    
    // Add some CSS animations via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        .refreshing {
            animation: spin 1s linear;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .paused {
            background-color: #f44336 !important;
        }
        
        .fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1000;
            background: white;
        }
        
        .sensor-box {
            transition: transform 0.3s ease;
        }
        
        .sensor-box:hover {
            transform: translateY(-5px);
        }
        
        .pulse-dot {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JalmitraDashboard;
}