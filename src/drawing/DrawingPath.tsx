import React from 'react';
import classNames from 'classnames';
import { Path, Position, Stroke } from '../@types';

type Props = {
    className?: string;
    path?: Path;
    stroke?: Stroke;
};

const defaultStroke = {
    color: '#000',
    size: 4,
};

export type DrawingPathRef = SVGPathElement;

export const getCubicBezierCurve = (points?: Position[]): string => {
    if (!points) {
        return '';
    }

    return points
        .map(({ x, y }, index, array) => {
            if (index === 0) {
                return `M ${x} ${y}`;
            }

            const prevPoint = array[index - 1];
            const nextPoint = array[index + 1];
            if (!prevPoint || !nextPoint) {
                return '';
            }

            const xc1 = (x + prevPoint.x) / 2;
            const yc1 = (y + prevPoint.y) / 2;
            const xc2 = (x + nextPoint.x) / 2;
            const yc2 = (y + nextPoint.y) / 2;

            return `C ${xc1} ${yc1}, ${x} ${y}, ${xc2} ${yc2}`;
        })
        .join(' ');
};

export const drawQuadraticBezier = (points?: Position[]): string => {
    if (!points) {
        return '';
    }

    return points
        .map(({ x, y }, index, array) => {
            if (index === 0) {
                return `M ${x} ${y}`;
            }

            const nextPoint = array[index + 1];
            if (!nextPoint) {
                return '';
            }

            const xc = (x + nextPoint.x) / 2;
            const yc = (y + nextPoint.y) / 2;

            return `Q ${x} ${y}, ${xc} ${yc}`;
        })
        .join(' ');
};

export const drawStraight = (points?: Position[]): string => {
    if (!points) {
        return '';
    }

    return points
        .map(({ x, y }, index) => {
            if (index === 0) {
                return `M ${x} ${y}`;
            }

            return `L ${x} ${y}`;
        })
        .join(' ');
};

export const getPathCommand = getCubicBezierCurve;

export const DrawingPath = (props: Props, ref: React.Ref<DrawingPathRef>): JSX.Element => {
    const {
        className,
        path: { points } = {},
        stroke: { color: strokeColor, size: strokeWidth } = defaultStroke,
    } = props;
    const d = getPathCommand(points);

    return (
        <path
            ref={ref}
            className={classNames(className, 'ba-DrawingPath')}
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
        />
    );
};

export default React.forwardRef(DrawingPath);
