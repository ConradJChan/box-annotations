import * as React from 'react';
import * as uuid from 'uuid';
import classNames from 'classnames';
import DrawingList from './DrawingList';
import DrawingCreator from './DrawingCreator';
import DrawingPathGroup from './DrawingPathGroup';
import DrawingSVG, { DrawingSVGRef } from './DrawingSVG';
import PopupDrawingToolbar from '../components/Popups/PopupDrawingToolbar';
import { AnnotationDrawing, PathGroup } from '../@types';
import { CreatorItemDrawing, CreatorStatus } from '../store';
import './DrawingAnnotations.scss';

export type Props = {
    activeAnnotationId: string | null;
    annotations: AnnotationDrawing[];
    isCreating: boolean;
    isCurrentFileVersion: boolean;
    location: number;
    resetCreator: () => void;
    setActiveAnnotationId: (annotationId: string | null) => void;
    setReferenceId: (uuid: string) => void;
    setStaged: (staged: CreatorItemDrawing | null) => void;
    setStatus: (status: CreatorStatus) => void;
    staged?: CreatorItemDrawing | null;
};

const DrawingAnnotations = (props: Props): JSX.Element => {
    const {
        activeAnnotationId,
        annotations,
        isCreating,
        isCurrentFileVersion,
        location,
        resetCreator,
        setActiveAnnotationId,
        setReferenceId,
        setStaged,
        setStatus,
        staged,
    } = props;
    const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
    const [isToolbarVisible, setIsToolbarVisible] = React.useState<boolean>(true);
    const [stagedRootEl, setStagedRootEl] = React.useState<DrawingSVGRef | null>(null);
    const stagedGroupRef = React.useRef<SVGGElement>(null);
    const uuidRef = React.useRef<string>(uuid.v4());

    const handleAnnotationActive = (annotationId: string | null): void => {
        setActiveAnnotationId(annotationId);
    };
    const handleDelete = (): void => {
        resetCreator();
    };
    const handleRedo = (): void => {
        const { drawnPathGroups = [], stashedPathGroups = [] } = staged || {};
        const redoPathGroup = stashedPathGroups.slice(-1);
        const payload = {
            drawnPathGroups: drawnPathGroups.concat(redoPathGroup),
            location,
            stashedPathGroups: stashedPathGroups.slice(0, -1),
        };

        setStaged(payload);
    };
    const handleReply = (): void => {
        setReferenceId(uuidRef.current);
        setIsToolbarVisible(false);
    };
    const handleStart = (): void => {
        if (staged === null) {
            setStaged(null);
        }
        setStatus(CreatorStatus.started);
        setIsDrawing(true);
    };
    const handleStop = (pathGroup: PathGroup): void => {
        const { drawnPathGroups = [] } = staged || {};
        const payload = {
            drawnPathGroups: drawnPathGroups.concat(pathGroup),
            location,
            stashedPathGroups: [],
        };

        setStaged(payload);
        setStatus(CreatorStatus.staged);
        setIsDrawing(false);
    };
    const handleUndo = (): void => {
        const { drawnPathGroups = [], stashedPathGroups = [] } = staged || {};
        const undoPathGroup = drawnPathGroups.slice(-1);
        const payload = {
            drawnPathGroups: drawnPathGroups.slice(0, -1),
            location,
            stashedPathGroups: stashedPathGroups.concat(undoPathGroup),
        };

        setStaged(payload);
    };

    React.useEffect(() => {
        if (staged) {
            return;
        }

        setIsToolbarVisible(true);
    }, [staged]);

    return (
        <>
            <DrawingList
                activeId={activeAnnotationId}
                annotations={annotations}
                className="ba-DrawingAnnotations-list"
                data-resin-iscurrent={isCurrentFileVersion}
                onSelect={handleAnnotationActive}
            />

            {staged && (
                <DrawingSVG ref={setStagedRootEl} className="ba-DrawingAnnotations-target">
                    <g ref={stagedGroupRef} data-ba-reference-id={uuidRef.current}>
                        {staged.drawnPathGroups.map(pathGroup => (
                            <DrawingPathGroup key={pathGroup.clientId} pathGroup={pathGroup} rootEl={stagedRootEl} />
                        ))}
                    </g>
                </DrawingSVG>
            )}

            {isCreating && (
                <DrawingCreator className="ba-DrawingAnnotations-creator" onStart={handleStart} onStop={handleStop} />
            )}

            {staged && stagedGroupRef.current && isToolbarVisible && (
                <PopupDrawingToolbar
                    canRedo={staged.stashedPathGroups.length > 0}
                    canUndo={staged.drawnPathGroups.length > 0}
                    className={classNames('ba-DrawingAnnotations-toolbar', { 'is-faded': isDrawing })}
                    onDelete={handleDelete}
                    onRedo={handleRedo}
                    onReply={handleReply}
                    onUndo={handleUndo}
                    reference={stagedGroupRef.current}
                />
            )}
        </>
    );
};

export default DrawingAnnotations;
