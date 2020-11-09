import * as React from 'react';
import * as ReactRedux from 'react-redux';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { MOUSE_PRIMARY } from '../constants';
import { TargetDrawing } from '../@types';
import { getIsCurrentFileVersion } from '../store';
import { getShape } from './drawingUtil';
import './DrawingTarget.scss';

type Props = {
    annotationId: string;
    className?: string;
    isActive?: boolean;
    onSelect?: (annotationId: string) => void;
    target: TargetDrawing;
};

export type DrawingTargetRef = HTMLAnchorElement;

export const DrawingTarget = (props: Props, ref: React.Ref<DrawingTargetRef>): JSX.Element => {
    const isCurrentFileVersion = ReactRedux.useSelector(getIsCurrentFileVersion);
    const {
        annotationId,
        className,
        isActive = false,
        onSelect = noop,
        target: { path_groups: pathGroups },
    } = props;
    const { height, width, x, y } = getShape(pathGroups);
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const handleFocus = (): void => {
        onSelect(annotationId);
    };
    const handleMouseDown = (event: React.MouseEvent<DrawingTargetRef>): void => {
        if (event.buttons !== MOUSE_PRIMARY) {
            return;
        }
        const activeElement = document.activeElement as HTMLElement;

        onSelect(annotationId);

        event.preventDefault(); // Prevents focus from leaving the button immediately in some browsers
        event.nativeEvent.stopImmediatePropagation(); // Prevents document event handlers from executing

        // IE11 won't apply the focus to the SVG anchor, so this workaround attempts to blur the existing
        // active element.
        if (activeElement && activeElement !== event.currentTarget && activeElement.blur) {
            activeElement.blur();
        }

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
            href="#"
            onFocus={handleFocus}
            onMouseDown={handleMouseDown}
            role="button"
            tabIndex={0}
        >
            <rect
                fill="transparent"
                height={height}
                transform={`translate(-${centerX * 0.1}, -${centerY * 0.1}) scale(1.1)`}
                width={width}
                x={x}
                y={y}
            />
        </a>
    );
};

export default React.forwardRef(DrawingTarget);
