import React from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import DrawingTarget from './DrawingTarget';
import useOutsideEvent from '../common/useOutsideEvent';
import { AnnotationDrawing, Dimensions } from '../@types';
import { checkValue } from '../utils/util';
import { getShape } from './drawingUtil';

export type Props = {
    activeId?: string | null;
    annotations: AnnotationDrawing[];
    className?: string;
    onSelect?: (annotationId: string | null) => void;
};

export const filterDrawing = ({ target: { path_groups: pathGroups } }: AnnotationDrawing): boolean =>
    pathGroups.every(({ paths }) =>
        paths.every(({ points }) => points.every(({ x, y }) => checkValue(x) && checkValue(y))),
    );

export function scaleDrawing(annotationDrawing: AnnotationDrawing, { height, width }: Dimensions): AnnotationDrawing {
    const scaledAnnotationDrawing = cloneDeep(annotationDrawing);
    const {
        target: { path_groups: pathGroups },
    } = scaledAnnotationDrawing;

    pathGroups.forEach(({ paths }) => {
        paths.forEach(({ points }) => {
            points.forEach(point => {
                const { x, y } = point;
                point.x = (x / 100) * width;
                point.y = (y / 100) * height;
            });
        });
    });

    return scaledAnnotationDrawing;
}

export function sortDrawing({ target: targetA }: AnnotationDrawing, { target: targetB }: AnnotationDrawing): number {
    const { height: heightA, width: widthA } = getShape(targetA.path_groups);
    const { height: heightB, width: widthB } = getShape(targetB.path_groups);

    // If B is smaller, the result is negative.
    // So, A is sorted to an index lower than B, which means A will be rendered first at bottom
    return heightB * widthB - heightA * widthA;
}

export function DrawingList({ activeId = null, annotations, className, onSelect = noop }: Props): JSX.Element {
    const [isListening, setIsListening] = React.useState(true);
    const [rootDimension, setRootDimension] = React.useState<Dimensions>();
    const rootElRef = React.createRef<SVGSVGElement>();

    // Document-level event handlers for focus and pointer control
    useOutsideEvent('mousedown', rootElRef, (): void => {
        onSelect(null);
        setIsListening(false);
    });
    useOutsideEvent('mouseup', rootElRef, (): void => setIsListening(true));

    React.useEffect(() => {
        const { current: rootEl } = rootElRef;
        if (!rootEl) {
            return;
        }
        setRootDimension({
            height: rootEl.clientHeight,
            width: rootEl.clientWidth,
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <svg
            ref={rootElRef}
            className={classNames(className, { 'is-listening': isListening })}
            data-resin-component="drawingList"
        >
            {rootDimension &&
                annotations
                    .filter(filterDrawing)
                    .sort(sortDrawing)
                    .map(drawing => scaleDrawing(drawing, rootDimension))
                    .map(({ id, target }) => (
                        <DrawingTarget
                            key={id}
                            annotationId={id}
                            isActive={activeId === id}
                            onSelect={onSelect}
                            target={target}
                        />
                    ))}
        </svg>
    );
}

export default React.memo(DrawingList);
