import React from 'react';
import classNames from 'classnames';
import PopupBase from './PopupBase';
import { Options, PopupReference } from './Popper';
import './PopupDrawingToolbar.scss';

type Props = {
    canRedo: boolean;
    canUndo: boolean;
    className?: string;
    onDelete: () => void;
    onRedo: () => void;
    onReply: () => void;
    onUndo: () => void;
    reference: PopupReference;
};

const options: Partial<Options> = {
    modifiers: [
        {
            name: 'eventListeners',
            options: {
                scroll: false,
            },
        },
        {
            name: 'offset',
            options: {
                offset: [0, 8],
            },
        },
        {
            name: 'preventOverflow',
            options: {
                padding: 5,
            },
        },
    ],
    placement: 'top',
};

const PopupDrawingToolbar = (props: Props): JSX.Element => {
    const { canRedo, canUndo, className, onDelete, onRedo, onReply, onUndo, reference } = props;

    return (
        <PopupBase
            className={classNames(className, 'ba-PopupDrawingToolbar')}
            data-resin-component="popupDrawingToolbar"
            options={options}
            reference={reference}
        >
            {/* anchor for dragging */}
            {/* undo button */}
            <button
                className="ba-PopupDrawingToolbar-undo"
                data-testid="ba-PopupDrawingToolbar-undo"
                disabled={!canUndo}
                onClick={() => onUndo()}
                type="button"
            >
                U
            </button>
            {/* redo button */}
            <button
                className="ba-PopupDrawingToolbar-redo"
                data-testid="ba-PopupDrawingToolbar-redo"
                disabled={!canRedo}
                onClick={() => onRedo()}
                type="button"
            >
                R
            </button>
            {/* trash button */}
            <button
                className="ba-PopupDrawingToolbar-delete"
                data-testid="ba-PopupDrawingToolbar-delete"
                onClick={() => onDelete()}
                type="button"
            >
                D
            </button>
            {/* add comment button */}
            <button
                className="ba-PopupDrawingToolbar-comment"
                data-testid="ba-PopupDrawingToolbar-comment"
                onClick={() => onReply()}
                type="button"
            >
                Add Comment
            </button>
        </PopupBase>
    );
};

export default PopupDrawingToolbar;
