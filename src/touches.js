export class Touches {

    constructor(element) {
        this.element = element;
        this.startTime = 0;
        this.endTime = 0;
        this.longPressThreshold = 500; // Порог времени для долгого нажатия (в мс)
        this.tapThreshold = 10; // Максимальное расстояние перемещения для тапа

        this.startDistance = 0; // Начальное расстояние между пальцами для pinch
        this.endDistance = 0; // Конечное расстояние между пальцами

        // Привязка контекста this к методам
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        // Добавление слушателей событий
        this.initListeners();
    }

    init() {

    }

    initListeners() {
        this.element.addEventListener('touchstart', this.handleTouchStart, false);
        this.element.addEventListener('touchmove', this.handleTouchMove, false);
        this.element.addEventListener('touchend', this.handleTouchEnd, false);
    }

    handleTouchStart(event) {
        const touch = event.touches[0];
        this.startTime = Date.now();
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;

        if (event.touches.length > 1) {
            const touch2 = event.touches[1];
            this.startDistance = this.calculateDistance(touch, touch2);
        }
    }

    handleTouchMove(event) {
        event.preventDefault()
        if (event.touches.length > 1) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            this.endDistance = this.calculateDistance(touch1, touch2);
        }
    }

    handleTouchEnd(event) {
        event.preventDefault()
        this.endTime = Date.now();
        const touchDuration = this.endTime - this.startTime;

        this.touchEndX = event.changedTouches[0].clientX;
        this.touchEndY = event.changedTouches[0].clientY;

        const xDiff = this.touchEndX - this.touchStartX;
        const yDiff = this.touchEndY - this.touchStartY;

        if (Math.abs(xDiff) < this.tapThreshold && Math.abs(yDiff) < this.tapThreshold) {
            if (touchDuration < this.longPressThreshold) {
                console.log('Tap');
            } else {
                console.log('Long Press');
            }
        } else {
            this.detectSwipe();
        }

        if (this.startDistance > 0 && this.endDistance > 0) {
            if (this.endDistance > this.startDistance) {
                console.log('Pinch Out');
            } else {
                console.log('Pinch In');
            }
        }

        // Сброс значений
        this.startDistance = 0;
        this.endDistance = 0;
    }

    detectSwipe() {
        const threshold = 100; // Минимальное расстояние для свайпа
        const xDiff = this.touchEndX - this.touchStartX;
        const yDiff = this.touchEndY - this.touchStartY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) { // Свайп по горизонтали
            if (xDiff > threshold) {
                console.log('Swipe Right');
            } else if (xDiff < -threshold) {
                console.log('Swipe Left');
            }
        } else { // Свайп по вертикали
            if (yDiff > threshold) {
                console.log('Swipe Down');
            } else if (yDiff < -threshold) {
                console.log('Swipe Up');
            }
        }
    }

    calculateDistance(touch1, touch2) {
        const xDiff = touch2.clientX - touch1.clientX;
        const yDiff = touch2.clientY - touch1.clientY;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }


}