 document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('bmi-form');
    const tabs = document.querySelectorAll('.unit-tab');
    const metricHeight = document.querySelector('.metric-height');
    const imperialHeight = document.querySelector('.imperial-height');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const heightFtInput = document.getElementById('height-ft');
    const heightInInput = document.getElementById('height-in');
    const resultContainer = document.getElementById('result-container');
    const bmiValueEl = document.getElementById('bmi-value');
    const bmiCategoryEl = document.getElementById('bmi-category');
    const bmiDescriptionEl = document.getElementById('bmi-description');
    const progressRing = document.querySelector('.progress-ring');
    const weightUnitLabel = document.querySelector('.input-group .unit-label');

    // State
    let currentUnit = 'metric';

    // Constants
    const CIRCUMFERENCE = 2 * Math.PI * 45; // 283 roughly

    // Event Listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchUnit(tab.dataset.unit);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBMI();
    });

    // Functions
    function switchUnit(unit) {
        currentUnit = unit;
        
        // Update tabs UI
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-unit="${unit}"]`).classList.add('active');

        // Toggle Inputs
        if (unit === 'metric') {
            metricHeight.classList.remove('hidden');
            imperialHeight.classList.add('hidden');
            metricHeight.querySelector('input').setAttribute('required', '');
            imperialHeight.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
            weightUnitLabel.textContent = 'kg';
            weightInput.placeholder = '0';
        } else {
            metricHeight.classList.add('hidden');
            imperialHeight.classList.remove('hidden');
            metricHeight.querySelector('input').removeAttribute('required');
            imperialHeight.querySelectorAll('input').forEach(i => i.setAttribute('required', ''));
            weightUnitLabel.textContent = 'lbs';
            weightInput.placeholder = '0';
        }

        // Clear results when switching units to avoid confusion
        resultContainer.classList.add('hidden');
    }

    function calculateBMI() {
        let weight = parseFloat(weightInput.value);
        let height;
        let bmi = 0;

        if (isNaN(weight) || weight <= 0) return;

        if (currentUnit === 'metric') {
            height = parseFloat(heightInput.value);
            if (isNaN(height) || height <= 0) return;
            
            // BMI = weight(kg) / height(m)^2
            bmi = weight / Math.pow(height / 100, 2);

        } else {
            const ft = parseFloat(heightFtInput.value) || 0;
            const inch = parseFloat(heightInInput.value) || 0;
            const totalInches = (ft * 12) + inch;
            
            if (totalInches <= 0) return;

            // BMI = 703 * weight(lbs) / height(in)^2
            bmi = 703 * weight / Math.pow(totalInches, 2);
        }

        displayResult(bmi);
    }

    function displayResult(bmi) {
        // Round to 1 decimal
        const roundedBMI = Math.round(bmi * 10) / 10;
        
        // Determine Category
        let category = '';
        let color = '';
        let description = '';
        let percentage = 0; // For the gauge (0-100)

        // Logic for gauge: 
        // 10-18.5 is roughly 0-25%
        // 18.5-25 is 25-50%
        // 25-30 is 50-75%
        // 30-40+ is 75-100%
        // We can map logic to make it look nice on the ring

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#f1c40f'; // Yellow
            description = 'You are in the underweight range. It is recommended to eat a nutritious diet and consult a healthcare provider.';
            // Map 10-18.5 to 0-25%
            percentage = Math.max(0, ((bmi - 10) / (18.5 - 10)) * 25);
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            color = '#00b894'; // Green
            description = 'Great job! You are within the healthy weight range. Keep maintaining a balanced diet and regular exercise.';
            // Map 18.5-25 to 25-50%
            percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            color = '#e67e22'; // Orange
            description = 'You are in the overweight range. Adopt a healthier lifestyle with balanced nutrition and physical activity.';
            // Map 25-30 to 50-75%
            percentage = 50 + ((bmi - 25) / (30 - 25)) * 25;
        } else {
            category = 'Obese';
            color = '#ff7675'; // Red
            description = 'You are in the obese range. Please consult a healthcare provider for advice on achieving a healthier weight.';
            // Map 30-40 to 75-100% (cap at 100)
            percentage = Math.min(100, 75 + ((bmi - 30) / (40 - 30)) * 25);
        }

        // Update UI
        resultContainer.classList.remove('hidden');
        
        // Animate counter
        animateValue(bmiValueEl, 0, roundedBMI, 1000); // reuse existing or create helper

        bmiCategoryEl.textContent = category;
        bmiCategoryEl.style.color = color;
        bmiDescriptionEl.textContent = description;
        
        // Update Progress Ring
        const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
        progressRing.style.strokeDashoffset = offset;
        progressRing.style.stroke = color;
        
        // Scroll to result on mobile if needed
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start) + start).toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
