import {Point} from "../geometry";

function getNearestPoint(mouse, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    // разница между map и for ??
    // points.map(p => )
    // по идее не очень оптимизировано, можно ли лучше?
    for (const point of points) {

        const dist = distance(point, mouse)

        if (dist < minDist && dist < threshold ) {
            minDist = dist;
            // console.log('NEAREST',point)
            nearest = point;

        }
    }
    // console.log('NEAREST',nearest)

    return nearest;
}

// Функция для вычисления расстояния от точки до линии и нахождения ближайшей точки на этой линии
// function calculateDistanceAndNearestPoint(point, lineStart, lineEnd) {
//     const dxLine = lineEnd.x - lineStart.x;
//     const dyLine = lineEnd.y - lineStart.y;
//     const lenSq = dxLine * dxLine + dyLine * dyLine;
//
//     let param = 0;
//     if (lenSq != 0) { // Avoid division by zero
//         const dxPoint = point.x - lineStart.x;
//         const dyPoint = point.y - lineStart.y;
//         const dot = dxPoint * dxLine + dyPoint * dyLine;
//         param = dot / lenSq;
//     }
//
//     let nearestX, nearestY;
//     if (param < 0) {
//         nearestX = lineStart.x;
//         nearestY = lineStart.y;
//     } else if (param > 1) {
//         nearestX = lineEnd.x;
//         nearestY = lineEnd.y;
//     } else {
//         nearestX = lineStart.x + param * dxLine;
//         nearestY = lineStart.y + param * dyLine;
//     }
//
//     const dx = point.x - nearestX;
//     const dy = point.y - nearestY;
//     const distance = Math.sqrt(dx * dx + dy * dy);
//
//     return {
//         nearestPoint: { x: nearestX, y: nearestY },
//         distance: distance
//     };
// }
function calculateDistanceAndNearestPoint(point, lineStart, lineEnd) {
    // Преобразование координат в числа
    const x1 = +lineStart.x;
    const y1 = +lineStart.y;
    const x2 = +lineEnd.x;
    const y2 = +lineEnd.y;
    const px = +point.x;
    const py = +point.y;

    const dxLine = x2 - x1;
    const dyLine = y2 - y1;
    const lenSq = dxLine * dxLine + dyLine * dyLine;

    let param = 0;
    if (lenSq != 0) { // Избегаем деления на ноль
        const dxPoint = px - x1;
        const dyPoint = py - y1;
        const dot = dxPoint * dxLine + dyPoint * dyLine;
        param = dot / lenSq;
    }

    let nearestX, nearestY;
    if (param < 0) {
        nearestX = x1;
        nearestY = y1;
    } else if (param > 1) {
        nearestX = x2;
        nearestY = y2;
    } else {
        nearestX = x1 + param * dxLine;
        nearestY = y1 + param * dyLine;
    }

    const dx = px - nearestX;
    const dy = py - nearestY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return {
        nearestPoint: { x: nearestX, y: nearestY },
        distance: distance
    };
}

// function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
//     let minDist = Number.MAX_SAFE_INTEGER;
//     let nearest = null;
//     for (const seg of segments) {
//         const dist = seg.distanceToPoint(loc);
//         if (dist < minDist && dist < threshold) {
//             minDist = dist;
//             nearest = seg;
//         }
//     }
//     return nearest;
// }
// function getNearestSegments(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
//     let nearest = [];
//     for (const seg of segments) {
//         const dist = seg.distanceToPoint(loc);
//         if (dist < threshold) {
//             nearest.push(seg);
//         }
//     }
//     nearest.sort((a,b)=>a.distanceToPoint(loc)-b.distanceToPoint(loc));
//     return nearest;
// }

function closestPointOnLineSegment(mouse, p1, p2) {
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    if (dx === 0 && dy === 0) {
        // Отрезок - точка
        return [p1[0], p1[1]];
    }
    let t = ((mouse.x - p1[0]) * dx + (mouse.y - p1[1]) * dy) / (dx * dx + dy * dy);
    // console.log(mouse.x, p1, p2)

    t = Math.max(0, Math.min(1, t)); // Ограничиваем t значениями от 0 до 1
    return [p1[0] + t * dx, p1[1] + t * dy];
}

function findClosestPointOnPolygon(mouse, points) {
    let closestPoint = null;
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length; // Чтобы соединить последнюю и первую точку
        let point = closestPointOnLineSegment(mouse, points[i], points[j]);

        let dist = distance(point, mouse);

        if (dist < minDistance) {
            closestPoint = point;
            minDistance = dist;
        }
    }

    return closestPoint;
}


function distance(p1, p2) {
    // console.log(Math.hypot(p1[0] - p2.x, p1[1] - p2.y))
    // return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    return Math.hypot(p1[0] - p2.x, p1[1] - p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y)
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y)
}

function scale(p, scalar) {
    return new Point(p.x * scalar, p.y * scalar)
}

function findIntersection(A, B, C, D) {
    // A и B - точки первого сегмента, C и D - точки второго
    const denominator = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);
    if (denominator === 0) return null; // Линии параллельны

    const t = ((A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y)) / denominator;
    const u = ((A.y - C.y) * (B.x - A.x) - (A.x - C.x) * (B.y - A.y)) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        // Есть пересечение
        return new Point(A.x + t * (B.x - A.x), A.y + t * (B.y - A.y))
    }

    return null; // Линии не пересекаются
}

function findPolygonCenter(points) {
    if (!points || points.length === 0) {
        return null;
    }

    const numPoints = points.length;
    let sumX = 0, sumY = 0;
    // Суммируем все координаты x и y
    points.forEach(point => {
        // sumX += point.x;
        // sumY += point.y;
        sumX += point[0];
        sumY += point[1];
    });

    // Вычисляем среднее значение для x и y
    const centerX = sumX / points.length;
    const centerY = sumY / points.length;

    // Return the center as an object with 'x' and 'y' properties
    return new Point(centerX, centerY);
}

function isPointInsidePolygon(point, vertices) {
    let threshold = 0;
    let inside = false;
    const verticesCount = vertices.length;

    for (let i = 0, j = verticesCount - 1; i < verticesCount; j = i++) {
        const xi = vertices[i][0];
        const yi = vertices[i][1];
        const xj = vertices[j][0];
        const yj = vertices[j][1];

        const intersect = ((yi >= point.y - threshold) !== (yj >= point.y - threshold)) &&
            (point.x - threshold <= ((xj - xi) * (point.y + threshold - yi)) / (yj - yi) + xi);

        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

export {
    getNearestPoint,
    subtract,
    add,
    scale,
    findIntersection, findPolygonCenter,
    isPointInsidePolygon,
    findClosestPointOnPolygon,
    calculateDistanceAndNearestPoint
}