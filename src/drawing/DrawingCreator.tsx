import React from 'react';
import classNames from 'classnames';
import * as uuid from 'uuid';
import useAutoScroll from '../common/useAutoScroll';
import DrawingPath, { DrawingPathRef, getPathCommand } from './DrawingPath';
import { CreatorPathGroup } from '../store';
import { Position } from '../@types';
import { MOUSE_PRIMARY } from '../constants';
import './DrawingCreator.scss';

enum DrawingStatus {
    dragging = 'dragging',
    drawing = 'drawing',
    init = 'init',
}

type Props = {
    className?: string;
    onStart: () => void;
    onStop: (pathGroup: CreatorPathGroup) => void;
};

const defaultStroke = {
    color: '#000',
    size: 4,
};

export default function DrawingCreator({ className, onStart, onStop }: Props): JSX.Element {
    const [drawingStatus, setDrawingStatus] = React.useState<DrawingStatus>(DrawingStatus.init);
    const capturedPathRef = React.useRef<Array<Position>>([]);
    const creatorElRef = React.useRef<HTMLDivElement>(null);
    const drawingDirtyRef = React.useRef<boolean>(false);
    const drawingPathRef = React.useRef<DrawingPathRef>(null);
    const renderHandleRef = React.useRef<number | null>(null);

    const getPathGroup = (): CreatorPathGroup | null => {
        const { current: creatorEl } = creatorElRef;
        const { current: points } = capturedPathRef;

        if (!creatorEl || points.length === 0) {
            return null;
        }

        return {
            id: uuid.v4(),
            paths: [{ id: uuid.v4(), points }],
            stroke: defaultStroke,
        };
    };
    const getPosition = (x: number, y: number): [number, number] => {
        const { current: creatorEl } = creatorElRef;

        if (!creatorEl) {
            return [x, y];
        }

        // Calculate the new position based on the mouse position less the page offset
        // and convert to a percentage of the page
        const { height, left, top, width } = creatorEl.getBoundingClientRect();
        return [((x - left) / width) * 100, ((y - top) / height) * 100];
    };

    // Drawing Lifecycle Callbacks
    const startDraw = (x: number, y: number): void => {
        const [x1, y1] = getPosition(x, y);

        capturedPathRef.current = [{ x: x1, y: y1 }];
        drawingDirtyRef.current = true;

        setDrawingStatus(DrawingStatus.drawing);
        onStart();
    };
    const stopDraw = (): void => {
        const pathGroup = getPathGroup();

        setDrawingStatus(DrawingStatus.init);

        capturedPathRef.current = [];
        drawingDirtyRef.current = true;

        if (pathGroup) {
            onStop(pathGroup);
        }
    };
    const updateDraw = (x: number, y: number): void => {
        const [x2, y2] = getPosition(x, y);
        const { current: points } = capturedPathRef;

        points.push({ x: x2, y: y2 });
        drawingDirtyRef.current = true;
    };

    // Event Handlers
    const handleClick = (event: React.MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    };
    const handleMouseDown = ({ buttons, clientX, clientY }: React.MouseEvent): void => {
        if (buttons !== MOUSE_PRIMARY) {
            return;
        }

        startDraw(clientX, clientY);
    };
    const handleMouseMove = ({ buttons, clientX, clientY }: MouseEvent): void => {
        if (buttons !== MOUSE_PRIMARY || drawingStatus === DrawingStatus.init) {
            return;
        }

        updateDraw(clientX, clientY);
    };
    const handleMouseUp = (): void => {
        stopDraw();
    };
    const handleScroll = (x: number, y: number): void => {
        updateDraw(x, y);
    };
    const handleTouchCancel = (): void => {
        stopDraw();
    };
    const handleTouchEnd = (): void => {
        stopDraw();
    };
    const handleTouchMove = ({ targetTouches }: React.TouchEvent): void => {
        updateDraw(targetTouches[0].clientX, targetTouches[0].clientY);
    };
    const handleTouchStart = ({ targetTouches }: React.TouchEvent): void => {
        startDraw(targetTouches[0].clientX, targetTouches[0].clientY);
    };

    const renderStep = (callback: () => void): void => {
        renderHandleRef.current = window.requestAnimationFrame(callback);
    };
    const renderPath = (): void => {
        const { current: creatorEl } = creatorElRef;
        const { current: points } = capturedPathRef;
        const { current: isDirty } = drawingDirtyRef;
        const { current: svgPath } = drawingPathRef;

        if (!creatorEl) {
            return;
        }

        const d = getPathCommand(points);

        if (isDirty && svgPath && d.length) {
            svgPath.setAttribute('d', d);

            drawingDirtyRef.current = false;
        }

        renderStep(renderPath);
    };

    React.useEffect(() => {
        // Document-level mousemove and mouseup event listeners allow the creator component to respond even if
        // the cursor leaves the drawing area before the mouse button is released, which finishes the shape
        if (drawingStatus !== DrawingStatus.init) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            renderStep(renderPath);
        }

        return () => {
            const { current: renderHandle } = renderHandleRef;

            // Cancel the render loop
            if (renderHandle) {
                window.cancelAnimationFrame(renderHandle);
            }

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [drawingStatus]); // eslint-disable-line react-hooks/exhaustive-deps

    useAutoScroll({
        enabled: drawingStatus !== DrawingStatus.init,
        onScroll: handleScroll,
        reference: creatorElRef.current,
    });

    return (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <div
            ref={creatorElRef}
            className={classNames(className, 'ba-DrawingCreator')}
            data-testid="ba-DrawingCreator"
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onTouchCancel={handleTouchCancel}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            role="presentation"
        >
            <svg className="ba-DrawingCreator-current" preserveAspectRatio="none" viewBox="0 0 100 100">
                {drawingStatus === DrawingStatus.drawing && (
                    <DrawingPath ref={drawingPathRef} className="ba-DrawingCreator-path" stroke={defaultStroke} />
                )}
            </svg>
        </div>
    );
}
