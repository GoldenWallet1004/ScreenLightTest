const temperatureSlider = document.getElementById('temperature');
const brightnessSlider = document.getElementById('brightness');
const temperatureValue = document.getElementById('temperature-value');
const brightnessValue = document.getElementById('brightness-value');
const resetButton = document.getElementById('reset');
const container = document.querySelector('.container');
const overlay = document.getElementById('overlay');

// 默认值
const DEFAULT_TEMPERATURE = 4000;
const DEFAULT_BRIGHTNESS = 80;

// 计算颜色亮度
function calculateBrightness(r, g, b) {
    // 使用相对亮度公式: 0.299R + 0.587G + 0.114B
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// 更新UI颜色
function updateUIColor(r, g, b, brightness) {
    const relativeBrightness = calculateBrightness(r, g, b) * brightness / 100;
    
    // 当背景亮度超过0.5时，使用深色UI
    const isDark = relativeBrightness > 0.5;
    const uiColor = isDark ? '#000000' : '#ffffff';
    const uiBackground = isDark ? 
        'rgba(255, 255, 255, 0.2)' : 
        'rgba(0, 0, 0, 0.2)';
    
    // 更新UI元素颜色
    container.style.color = uiColor;
    document.querySelectorAll('.slider-container i').forEach(icon => {
        icon.style.color = uiColor;
    });
    document.querySelectorAll('#temperature-value, #brightness-value').forEach(value => {
        value.style.color = uiColor;
    });
    document.querySelector('h1').style.color = uiColor;
    
    // 更新滑块样式
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.style.background = uiBackground;
    });
    
    // 更新按钮样式
    const resetBtn = document.querySelector('.reset-button');
    resetBtn.style.background = uiColor;
    resetBtn.style.color = isDark ? '#ffffff' : '#000000';
    
    // 更新容器背景
    container.style.background = isDark ? 
        'rgba(0, 0, 0, 0.15)' : 
        'rgba(255, 255, 255, 0.15)';
}

// 更新色温显示和效果
function updateTemperature() {
    const value = temperatureSlider.value;
    temperatureValue.textContent = `${value}K`;
    
    const temp = value / 100;
    let r, g, b;
    
    if (temp <= 66) {
        r = 255;
        g = temp;
        g = 99.4708025861 * Math.log(g) - 161.1195681661;
        if (temp <= 19) {
            b = 0;
        } else {
            b = temp - 10;
            b = 138.5177312231 * Math.log(b) - 305.0447927307;
        }
    } else {
        r = temp - 60;
        r = 329.698727446 * Math.pow(r, -0.1332047592);
        g = temp - 60;
        g = 288.1221695283 * Math.pow(g, -0.0755148492);
        b = 255;
    }

    r = clamp(r, 0, 255);
    g = clamp(g, 0, 255);
    b = clamp(b, 0, 255);

    overlay.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    updateUIColor(r, g, b, brightnessSlider.value);
}

// 更新亮度显示和效果
function updateBrightness() {
    const value = brightnessSlider.value;
    brightnessValue.textContent = `${value}%`;
    overlay.style.opacity = value / 100;
    
    // 获取当前背景色
    const style = window.getComputedStyle(overlay);
    const bgcolor = style.backgroundColor;
    const match = bgcolor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        const [_, r, g, b] = match;
        updateUIColor(Number(r), Number(g), Number(b), value);
    }
}

// 辅助函数：限制数值范围
function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

// 重置功能
function reset() {
    temperatureSlider.value = DEFAULT_TEMPERATURE;
    brightnessSlider.value = DEFAULT_BRIGHTNESS;
    updateTemperature();
    updateBrightness();
}

// 事件监听
temperatureSlider.addEventListener('input', updateTemperature);
brightnessSlider.addEventListener('input', updateBrightness);
resetButton.addEventListener('click', reset);

// 初始化
reset();