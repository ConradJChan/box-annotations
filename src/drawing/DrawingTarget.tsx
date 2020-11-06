import * as React from 'react';
import * as ReactRedux from 'react-redux';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { getIsCurrentFileVersion } from '../store';
import { MOUSE_PRIMARY } from '../constants';
import './DrawingTarget.scss';
import { PathGroup, Shape } from '../@types';

type Props = {
    annotationId: string;
    className?: string;
    isActive?: boolean;
    onSelect?: (annotationId: string) => void;
    pathGroups: PathGroup[];
    shape: Shape;
};

export type DrawingTargetRef = HTMLAnchorElement;

export const DrawingTarget = (props: Props, ref: React.Ref<DrawingTargetRef>): JSX.Element => {
    const { annotationId, className, isActive = false, onSelect = noop, shape } = props;
    const isCurrentFileVersion = ReactRedux.useSelector(getIsCurrentFileVersion);
    const { height, width, x, y } = shape;

    const handleFocus = (): void => {
        onSelect(annotationId);
    };
    const handleMouseDown = (event: React.MouseEvent<DrawingTargetRef>): void => {
        if (event.buttons !== MOUSE_PRIMARY) {
            return;
        }

        event.preventDefault(); // Prevents focus from leaving the button immediately in some browsers
        event.nativeEvent.stopImmediatePropagation(); // Prevents document event handlers from executing
        event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS; triggers handleFocus
    };

    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
            ref={ref}
            className={classNames('ba-DrawingTarget', className, { 'is-active': isActive })}
            data-resin-iscurrent={isCurrentFileVersion}
            data-resin-itemid={annotationId}
            data-resin-target="highlightDrawing"
            data-testid={`ba-AnnotationTarget-${annotationId}`}
            onFocus={handleFocus}
            onMouseDown={handleMouseDown}
            role="button"
            tabIndex={0}
        >
            <rect fill="transparent" height={height} width={width} x={x} y={y} />
        </a>
    );
};

export default React.forwardRef(DrawingTarget);
