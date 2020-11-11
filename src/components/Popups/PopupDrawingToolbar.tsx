import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import IconRedo from 'box-ui-elements/es/icon/line/Redo16';
import IconTrash from 'box-ui-elements/es/icon/line/Trash16';
import IconUndo from 'box-ui-elements/es/icon/line/Undo16';
import IconToolbarGrabber16 from '../../icons/IconToolbarGrabber';
import messages from './messages';
import PopupBase from './PopupBase';
import { Options, PopupReference, Rect } from './Popper';
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
                offset: ({ popper }: { popper: Rect }) => [-popper.width / 2, 8],
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
            <div className="ba-PopupDrawingToolbar-group">
                <span className="ba-PopupDrawingToolbar-grabber">
                    <IconToolbarGrabber16 />
                </span>
            </div>
            <div className="ba-PopupDrawingToolbar-group">
                <button
                    className="ba-PopupDrawingToolbar-undo"
                    data-testid="ba-PopupDrawingToolbar-undo"
                    disabled={!canUndo}
                    onClick={() => onUndo()}
                    type="button"
                >
                    <IconUndo />
                </button>
                <button
                    className="ba-PopupDrawingToolbar-redo"
                    data-testid="ba-PopupDrawingToolbar-redo"
                    disabled={!canRedo}
                    onClick={() => onRedo()}
                    type="button"
                >
                    <IconRedo />
                </button>
                <button
                    className="ba-PopupDrawingToolbar-delete"
                    data-testid="ba-PopupDrawingToolbar-delete"
                    onClick={() => onDelete()}
                    type="button"
                >
                    <IconTrash />
                </button>
            </div>
            <button
                className="ba-PopupDrawingToolbar-comment"
                data-testid="ba-PopupDrawingToolbar-comment"
                onClick={() => onReply()}
                type="button"
            >
                <FormattedMessage {...messages.buttonAddComent} />
            </button>
        </PopupBase>
    );
};

export default PopupDrawingToolbar;
